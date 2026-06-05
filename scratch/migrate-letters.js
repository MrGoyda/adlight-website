// scratch/migrate-letters.js
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../dictionaries/services/details/volume-letters');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find slug
  const slugMatch = content.match(/slug:\s*["']([^"']+)["']/);
  if (!slugMatch) {
    console.error(`No slug found in ${file}`);
    return;
  }
  const slug = slugMatch[1];

  // Find quantity and height to parse them for total calculation
  const qtyMatch = content.match(/quantity:\s*["'](\d+)[^"']*["']/);
  const hMatch = content.match(/height:\s*["'](\d+)[^"']*["']/);

  if (!qtyMatch || !hMatch) {
    console.error(`Could not parse quantity or height in ${file}`);
    return;
  }

  const qty = parseInt(qtyMatch[1]);
  const h = parseInt(hMatch[1]);

  // Add import if not present
  if (!content.includes('SITE_PRICES_NUMERIC')) {
    content = `import { SITE_PRICES_NUMERIC, formatPrice } from "../../../../config/site";\n` + content;
  }

  // Replace price
  content = content.replace(/price:\s*["']\d+["']/g, `price: String(SITE_PRICES_NUMERIC.letters['${slug}'])`);

  // Replace priceExample total
  // e.g. total: "110 000 ₸" -> total: `${formatPrice(5 * 40 * SITE_PRICES_NUMERIC.letters['face-lit'])} ₸`
  const totalRegex = /total:\s*["'][^"']+["']/g;
  content = content.replace(totalRegex, `total: \`\${formatPrice(${qty} * ${h} * SITE_PRICES_NUMERIC.letters['${slug}'])} ₸\``);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Migrated ${file}: slug=${slug}, qty=${qty}, h=${h}`);
});
