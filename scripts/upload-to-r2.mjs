import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Загружаем .env.local
dotenv.config({ path: '.env.local' });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'adlight';
const publicCdnUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://media.adlight.kz';

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error('❌ Ошибка: В .env.local не заданы переменные R2 (CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const MANIFEST_PATH = path.join(process.cwd(), 'lib', 'media-manifest.json');

function getR2Key(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');

  if (normalized.startsWith('letters-galery/')) {
    return `portfolio/categories/volume-letters/${normalized.replace('letters-galery/', '')}`;
  }
  if (normalized.startsWith('portfolio/')) {
    return `portfolio/projects/${normalized.replace('portfolio/', '')}`;
  }

  const categoryFolders = [
    'lightboxes', 'neon', 'panel-brackets', 'roof-installations',
    'pylons', 'entrance-groups', 'facade-decoration', 'interior',
    'navigation', 'branding-cars', 'window-branding', 'led-screens',
    'architectural-lighting', 'banners-plates', 'exhibition-stands',
    'signboard-repair'
  ];

  for (const cat of categoryFolders) {
    if (normalized.startsWith(`${cat}/`)) {
      return `portfolio/categories/${cat}/${normalized.replace(`${cat}/`, '')}`;
    }
  }

  if (normalized.startsWith('pages/')) return `static/pages/${normalized.replace('pages/', '')}`;
  if (normalized.startsWith('calc/')) return `static/calc/${normalized.replace('calc/', '')}`;
  if (normalized.startsWith('clients/')) return `static/clients/${normalized.replace('clients/', '')}`;
  if (normalized.startsWith('icons/')) return `static/icons/${normalized.replace('icons/', '')}`;

  return `static/general/${normalized}`;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadFiles() {
  console.log('🚀 Начинаем оптимизацию (Sharp) и выгрузку в Cloudflare R2...');

  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    console.error('❌ Ошибка: Папка public/images не найдена.');
    process.exit(1);
  }

  const allFiles = getAllFiles(PUBLIC_IMAGES_DIR);
  console.log(`📸 Найдено ${allFiles.length} файлов.\n`);

  const manifest = {
    generatedAt: new Date().toISOString(),
    cdnBaseUrl: publicCdnUrl,
    categories: {},
    projects: {},
    files: {},
  };

  let uploadedCount = 0;
  let savedBytesTotal = 0;
  let errorCount = 0;

  for (const filePath of allFiles) {
    const relativePath = path.relative(PUBLIC_IMAGES_DIR, filePath);
    let r2Key = getR2Key(relativePath);
    const originalSize = fs.statSync(filePath).size;
    const ext = path.extname(filePath).toLowerCase();

    let uploadBuffer = fs.readFileSync(filePath);
    let contentType = 'application/octet-stream';

    // Авто-конвертация и сжатие в WebP для больших или старых тяжелых файлов
    if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
      try {
        // Если PNG/JPG или изображение > 150KB — сжимаем в WebP
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || originalSize > 150 * 1024) {
          uploadBuffer = await sharp(filePath)
            .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82, effort: 4 })
            .toBuffer();

          // Переименовываем расширение ключа на .webp
          r2Key = r2Key.replace(/\.(png|jpg|jpeg|avif)$/i, '.webp');
          contentType = 'image/webp';
        } else {
          contentType = ext === '.svg' ? 'image/svg+xml' : `image/${ext.replace('.', '')}`;
        }
      } catch (err) {
        console.warn(`⚠️ Не удалось сжать с помощью Sharp: ${relativePath}, используем оригинал.`);
      }
    }

    const savedBytes = Math.max(0, originalSize - uploadBuffer.length);
    savedBytesTotal += savedBytes;

    const cdnUrl = `${publicCdnUrl}/${r2Key}`;
    manifest.files[relativePath.replace(/\\/g, '/')] = cdnUrl;

    if (r2Key.startsWith('portfolio/categories/')) {
      const catKey = r2Key.replace('portfolio/categories/', '').split('/').slice(0, -1).join('/');
      if (!manifest.categories[catKey]) manifest.categories[catKey] = [];
      manifest.categories[catKey].push(cdnUrl);
    } else if (r2Key.startsWith('portfolio/projects/')) {
      const projKey = r2Key.replace('portfolio/projects/', '').split('/')[0];
      if (!manifest.projects[projKey]) manifest.projects[projKey] = [];
      manifest.projects[projKey].push(cdnUrl);
    }

    try {
      const savedKb = (savedBytes / 1024).toFixed(1);
      console.log(`[${uploadedCount + 1}/${allFiles.length}] ${relativePath} ➔ ${(uploadBuffer.length / 1024).toFixed(1)} KB (сэкономлено ${savedKb} KB)`);

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: r2Key,
        Body: uploadBuffer,
        ContentType: contentType,
        ContentDisposition: 'inline',
        CacheControl: 'public, max-age=31536000, immutable',
      });

      await s3Client.send(command);
      uploadedCount++;
    } catch (err) {
      console.error(`❌ Ошибка загрузки ${relativePath}:`, err.message);
      errorCount++;
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('\n==================================================');
  console.log(`🎉 ОПТИМИЗАЦИЯ И МИГРАЦИЯ В CLOUDFLARE R2 ЗАВЕРШЕНА!`);
  console.log(`✅ Успешно обработано: ${uploadedCount} файлов`);
  console.log(`⚡ Сэкономлено трафика и объема: ${(savedBytesTotal / (1024 * 1024)).toFixed(2)} МБ`);
  console.log(`📄 Манифест обновлен: ${MANIFEST_PATH}`);
  console.log('==================================================\n');
}

uploadFiles();
