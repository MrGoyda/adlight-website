const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../dictionaries/services/details/volume-letters');
const files = [
  'face-lit.ts',
  'full-lit.ts',
  'combo-lit.ts',
  'side-lit.ts',
  'perforated.ts',
  'acrylic-slim.ts',
  'day-night-effect.ts'
];

const honestText = " Мы честно рассказываем клиентам обо всех материалах: борта буквы изготавливаются из вспененного ПВХ толщиной 3, 5 или 8 мм с плотностью 0.45 или 0.60 и окрашиваются профессиональной краской Arton или Flame. Лицевая часть — это прочный китайский акрил толщиной 2-5 мм заводского качества или премиальный немецкий акрил. Для идеальной яркости и цвета мы применяем оригинальную немецкую транслюцентную пленку Oracal 8100 серии либо наносим сочную прямую УФ-печать в 200% на прозрачной пленке.";

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Ищем conceptDesc и добавляем наш честный текст, если его там еще нет
  if (content.includes('conceptDesc: "') && !content.includes('Мы честно рассказываем клиентам обо всех материалах')) {
    content = content.replace(
      /(conceptDesc: ")([^"]*)(")/,
      `$1$2${honestText}$3`
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added honest description to: ${file}`);
  }
});
