const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../dictionaries/services/details/volume-letters');

const badgeMapping = {
  'face-lit.ts': 'Световые буквы в Астане | Производство вывесок',
  'back-lit.ts': 'Буквы с контражуром Астана | Заказать вывеску',
  'combo-lit.ts': 'Световые вывески Астана | Лицо + Контражур',
  'side-lit.ts': 'Изготовление вывесок Астана | Светящиеся борта',
  'full-lit.ts': 'Объемные буквы в Астане | Полное свечение',
  'perforated.ts': 'Перфорированные буквы Астана | Вывески по дизайн-коду',
  'acrylic-slim.ts': 'Цельноклееный акрил Астана | Премиум вывески',
  'day-night-effect.ts': 'Вывески День-Ночь Астана | Магия свечения',
  'loft-lamps.ts': 'Ретро вывески Астана | Буквы с лампочками',
  'pixel-led.ts': 'Пиксельные буквы Астана | Сверхъяркие LED',
  'wood-style.ts': 'Эко вывески из дерева Астана | Элитная реклама',
  'non-lit.ts': 'Несветовые буквы Астана | Вывески для офиса'
};

Object.entries(badgeMapping).forEach(([file, newBadge]) => {
  const filePath = path.join(dirPath, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(
    /(badge:\s*")[^"]*(")/,
    `$1${newBadge}$2`
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated badge for: ${file} -> "${newBadge}"`);
  }
});
