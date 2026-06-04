const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../dictionaries/services/details/volume-letters');
const files = fs.readdirSync(dirPath);

files.forEach(file => {
  if (!file.endsWith('.ts')) return;
  const filePath = path.join(dirPath, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Обновляем Задник в Anatomy
  content = content.replace(
    /\{ title: "Задник \(Основа\)", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Задник (Основа)", desc: "Вспененный ПВХ толщиной 8 мм (плотностью 0.45 или 0.60) — жесткая и надежная основа для диодов и крепежа.", iconName: "Layers" }`
  );
  content = content.replace(
    /\{ title: "Задняя основа", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Задняя основа", desc: "Вспененный ПВХ толщиной 8 мм (плотностью 0.45 или 0.60) — прочная отражающая основа вывески.", iconName: "Layers" }`
  );
  content = content.replace(
    /\{ title: "Задник с крепежом", desc: "[^"]*", iconName: "Compass" \}/g,
    `{ title: "Задник с крепежом", desc: "Вспененный ПВХ толщиной 8 мм (плотностью 0.45 или 0.60) со скрытыми петлями или шпильками.", iconName: "Compass" }`
  );

  // 2. Обновляем Задник в expertSpecifications.rows
  // Заменим "Задник буквы" или аналогичный лейбл
  content = content.replace(
    /label: "Задник буквы",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/g,
    'label: "Задник буквы",\n        premium: "Вспененный ПВХ 8 мм повышенной плотности 0.60",\n        chineseAlternative: "Вспененный ПВХ 8 мм стандартной плотности 0.45"'
  );
  content = content.replace(
    /label: "Задняя стенка",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/g,
    'label: "Задняя стенка",\n        premium: "Вспененный ПВХ 8 мм повышенной плотности 0.60",\n        chineseAlternative: "Вспененный ПВХ 8 мм стандартной плотности 0.45"'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated backings for: ${file}`);
  }
});
