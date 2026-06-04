const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../dictionaries/services/details/volume-letters');

// 1. pixel-led.ts
let filePath = path.join(dirPath, 'pixel-led.ts');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /\{ title: "Борт буквы", desc: "Прочный вспененный ПВХ 8-10 мм, оклеенный Oracal 641 или окрашенный автоэмалью.", iconName: "Shield" \}/,
    `{ title: "Борт буквы", desc: "Вспененный ПВХ толщиной 8 мм (плотностью 0.45 или 0.60), окрашенный профессиональной краской Arton или Flame.", iconName: "Shield" }`
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated pixel-led.ts');
}

// 2. non-lit.ts
filePath = path.join(dirPath, 'non-lit.ts');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /premium: "Жесткий вспененный ПВХ пластик \(Германия\) повышенной плотности 8-10 мм"/,
    `premium: "Жесткий вспененный ПВХ толщиной 8 мм с повышенной плотностью 0.60"`
  );
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated non-lit.ts');
}
