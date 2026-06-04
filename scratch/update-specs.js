const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../dictionaries/services/details/volume-letters');

// 1. face-lit.ts
let file = 'face-lit.ts';
let filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Лицевая поверхность", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Лицевая поверхность", desc: "Китайский акрил 2-5 мм заводского качества или немецкий акрил. Для цвета используется оригинальная светопропускающая немецкая пленка Oracal 8100 серии либо УФ-печать 200% на прозрачной пленке.", iconName: "Layers" }`
  );
  content = content.replace(
    /\{ title: "Боковой профиль", desc: "[^"]*", iconName: "Shield" \}/g,
    `{ title: "Боковой профиль", desc: "Вспененный ПВХ 3, 5 или 8 мм (плотностью 0.45 или 0.60), окрашенный профессиональной краской Arton или Flame.", iconName: "Shield" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Лицевая панель",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Лицевая панель",\n        premium: "Немецкий литой акрил 2-5 мм + пленка Oracal 8100 / УФ 200%",\n        chineseAlternative: "Заводской китайский акрил 2-5 мм + качественная пленка"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 2. back-lit.ts
file = 'back-lit.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Непрозрачный фасад", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Непрозрачный фасад", desc: "Шлифованная нержавеющая сталь, композит или вспененный ПВХ 3, 5, 8 мм (плотностью 0.45 или 0.60), окрашенный краской Arton или Flame.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Лицевая и боковые части",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Лицевая и боковые части",\n        premium: "Шлифованная сталь / ПВХ 3-8 мм (плотность 0.60) + краска Arton / Flame",\n        chineseAlternative: "Вспененный ПВХ 3-5 мм (плотность 0.45) + окрашивание Flame / Arton"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 3. combo-lit.ts
file = 'combo-lit.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Световое лицо", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Световое лицо", desc: "Китайский акрил 2-5 мм заводского качества или немецкий акрил + пленка Oracal 8100 или УФ-печать в 200% на прозрачной пленке.", iconName: "Layers" }`
  );
  content = content.replace(
    /\{ title: "Непрозрачный борт", desc: "[^"]*", iconName: "Shield" \}/g,
    `{ title: "Непрозрачный борт", desc: "Вспененный ПВХ 3, 5 или 8 мм (плотностью 0.45 или 0.60), окрашенный профессиональной краской Arton или Flame.", iconName: "Shield" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Лицевая панель",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Лицевая панель",\n        premium: "Немецкий акрил 2-5 мм + пленка Oracal 8100 / УФ 200%",\n        chineseAlternative: "Заводской китайский акрил 2-5 мм + качественная пленка"`
  );
  content = content.replace(
    /label: "Боковины букв",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Боковины букв",\n        premium: "ПВХ 3-8 мм (плотность 0.60) + краска Arton / Flame",\n        chineseAlternative: "ПВХ 3-5 мм (плотность 0.45) + окрашивание Flame / Arton"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 4. side-lit.ts
file = 'side-lit.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Непрозрачное лицо", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Непрозрачное лицо", desc: "Композит, алюминий или вспененный ПВХ 3, 5, 8 мм (плотностью 0.45 или 0.60), окрашенный профессиональной краской Arton или Flame.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Лицевая плоскость",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Лицевая плоскость",\n        premium: "ПВХ 8 мм (плотность 0.60) + краска Arton / Flame / композит",\n        chineseAlternative: "Вспененный ПВХ 5 мм (плотность 0.45) + окрашивание Flame / Arton"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 5. full-lit.ts
file = 'full-lit.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Лицевой акрил", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Лицевой акрил", desc: "Немецкий акрил Plexiglas или заводской китайский акрил 2-5 мм + транслюцентная пленка Oracal 8100 или УФ-печать в 200%.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Материал корпуса",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Материал корпуса",\n        premium: "Немецкий литой акрил 2-5 мм + пленка Oracal 8100 / УФ 200%",\n        chineseAlternative: "Заводской китайский акрил 2-5 мм + качественная пленка"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 6. perforated.ts
file = 'perforated.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Лицевая часть", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Лицевая часть", desc: "Немецкий литой акрил или китайский акрил 2-5 мм заводского качества + пленка Oracal 8100 или УФ-печать 200% на прозрачной пленке.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Лицевая панель",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Лицевая панель",\n        premium: "Немецкий литой акрил 2-5 мм + пленка Oracal 8100 / УФ 200%",\n        chineseAlternative: "Заводской китайский акрил 2-5 мм + качественная пленка"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 7. acrylic-slim.ts
file = 'acrylic-slim.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Лицевая плоскость", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Лицевая плоскость", desc: "Литой немецкий акрил Plexiglas GS или китайский акрил 2-5 мм заводского качества + пленка Oracal 8100 / УФ-печать 200%.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Лицевая плоскость",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Лицевая плоскость",\n        premium: "Немецкий литой акрил 2-5 мм + пленка Oracal 8100 / УФ 200%",\n        chineseAlternative: "Заводской китайский акрил 2-5 мм + качественная пленка"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 8. day-night-effect.ts
file = 'day-night-effect.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Лицевой акрил Plexiglas", desc: "[^"]*", iconName: "Shield" \}/g,
    `{ title: "Лицевой акрил Plexiglas", desc: "Немецкий литой акрил или китайский акрил 2-5 мм заводского качества. Светопропускающая пленка Oracal 8100 или УФ-печать 200%.", iconName: "Shield" }`
  );
  content = content.replace(
    /\{ title: "Непрозрачный борт буквы", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Непрозрачный борт буквы", desc: "Вспененный ПВХ 3, 5 или 8 мм (плотностью 0.45 или 0.60), окрашенный профессиональной краской Arton или Flame.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Лицевой акриловый лист",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Лицевой акриловый лист",\n        premium: "Немецкий литой акрил 2-5 мм + пленка Oracal 8100 / УФ 200%",\n        chineseAlternative: "Заводской китайский акрил 2-5 мм + качественная пленка"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 9. loft-lamps.ts
file = 'loft-lamps.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Непрозрачный корпус", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Непрозрачный корпус", desc: "Вспененный ПВХ толщиной 3, 5 или 8 мм (плотность 0.45 или 0.60), покрытый профессиональной краской Arton или Flame.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Материал корпуса",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Материал корпуса",\n        premium: "Нержавеющая сталь / ПВХ 3-8 мм (плотность 0.60) + краска Arton / Flame",\n        chineseAlternative: "Вспененный ПВХ 3-5 мм (плотность 0.45) + окрашивание Flame / Arton"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 10. pixel-led.ts
file = 'pixel-led.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Лицевая крышка", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Лицевая крышка", desc: "Композит или вспененный ПВХ 3, 5, 8 мм (плотностью 0.45 или 0.60), окрашенный профессиональной краской Arton или Flame с фрезеровкой под диоды.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Материал лица и бортов",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Материал лица и бортов",\n        premium: "Алюминиевый композит / ПВХ 3-8 мм (плотность 0.60) + краска Arton / Flame",\n        chineseAlternative: "Вспененный ПВХ 3-5 мм (плотность 0.45) + окрашивание Flame / Arton"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// 11. non-lit.ts
file = 'non-lit.ts';
filePath = path.join(dirPath, file);
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Anatomy
  content = content.replace(
    /\{ title: "Плотный ПВХ", desc: "[^"]*", iconName: "Layers" \}/g,
    `{ title: "Плотный ПВХ", desc: "Вспененный ПВХ толщиной 3, 5 или 8 мм (плотность 0.45 или 0.60), окрашенный профессиональной краской Arton или Flame.", iconName: "Layers" }`
  );
  
  // Update Specifications
  content = content.replace(
    /label: "Материал букв",\s*premium: "[^"]*",\s*chineseAlternative: "[^"]*"/,
    `label: "Материал букв",\n        premium: "Немецкий акрил 2-5 мм + пленка Oracal 8100 / УФ 200% или ПВХ 8 мм + краска Arton / Flame",\n        chineseAlternative: "Заводской китайский акрил 2-5 мм или вспененный ПВХ 3-5 мм с пленкой"`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
