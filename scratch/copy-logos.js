const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'Логотипы заказчиков');
const dstDir = path.join(__dirname, '..', 'public', 'images', 'clients');

if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
}

const mappings = {
    'DISFLEXIC HOME SCHOOL.png': 'disflexic-home-school.png',
    'DKC.png': 'dkc.png',
    'Green Leaf.png': 'green-leaf.png',
    'Happy Day.png': 'happy-day.png',
    'Korean House.png': 'korean-house.png',
    'LC.png': 'lc.png',
    'Lunda.png': 'lunda.png',
    'MazaltovMan.png': 'mazaltov-man.png',
    'NEURO ACADEMY.png': 'neuro-academy.png',
    'Prosto-top.png': 'prosto-top.png',
    'Reikartz Hotel.png': 'reikartz-hotel.png',
    'SF.png': 'sf.png',
    'Visa.png': 'visa.png',
    'Wroom Autohouse.png': 'wroom-autohouse.png',
    'dars.png': 'dars.png',
    'АйльянсФранкейс.png': 'alliance-francaise.png',
    'КазЭксиМекс.png': 'kazeximex.png',
    'Нейродин.png': 'neurodin.png',
    'Позитивные вибрации.png': 'positive-vibrations.png',
    'Стумари.png': 'stumari.png',
    'Яндекс Про.png': 'yandex-pro.png',
    'архипросто.png': 'archiprosto.png',
    'профдор.png': 'profdor.png'
};

for (const [srcName, dstName] of Object.entries(mappings)) {
    const srcPath = path.join(srcDir, srcName);
    const dstPath = path.join(dstDir, dstName);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, dstPath);
        console.log(`Copied: ${srcName} -> ${dstName}`);
    } else {
        console.log(`Not found: ${srcName}`);
    }
}
console.log('Done copying client logos!');
