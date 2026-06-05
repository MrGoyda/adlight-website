const fs = require('fs');
const path = require('path');

const detailsDir = path.join(__dirname, '../dictionaries/services/details');
const files = fs.readdirSync(detailsDir).filter(f => f.endsWith('.ts'));

const collected = {};

files.forEach(file => {
  const filePath = path.join(detailsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const slug = file.replace('.ts', '');
  
  collected[slug] = {
    price: null,
    pricingItems: [],
    subOffers: []
  };
  
  // 1. Извлечение базовой цены
  const priceMatch = content.match(/price:\s*"([^"]+)"/);
  if (priceMatch) {
    collected[slug].price = priceMatch[1];
  }
  
  // 2. Извлечение pricingItems
  const pricingItemsSection = content.match(/pricingItems:\s*\[([\s\S]*?)\]/);
  if (pricingItemsSection) {
    const itemsText = pricingItemsSection[1];
    const itemMatches = [...itemsText.matchAll(/label:\s*"([^"]+)",\s*value:\s*"([^"]+)"/g)];
    itemMatches.forEach(m => {
      collected[slug].pricingItems.push({ label: m[1], value: m[2] });
    });
  }
  
  // 3. Извлечение subOffers
  const subOffersSection = content.match(/subOffers:\s*\[([\s\S]*?)\]/);
  if (subOffersSection) {
    const subText = subOffersSection[1];
    const subMatches = [...subText.matchAll(/name:\s*"([^"]+)",\s*price:\s*"([^"]+)"/g)];
    subMatches.forEach(m => {
      collected[slug].subOffers.push({ name: m[1], price: m[2] });
    });
  }
});

console.log(JSON.stringify(collected, null, 2));
fs.writeFileSync(path.join(__dirname, 'collected_prices.json'), JSON.stringify(collected, null, 2));
