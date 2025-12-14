export default function JsonLd() {
  const baseUrl = "https://adlight.kz"; // Твой домен

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness", // Можно также использовать 'ProfessionalService'
    "name": "ADLight",
    // Важно: полный путь к картинке для роботов
    "image": `${baseUrl}/adlight-logo-full.webp`,
    "description": "Изготовление наружной рекламы в Астане: объемные буквы, лайтбоксы, широкоформатная печать.", // Добавил описание для лучшего понимания нейросетями
    "telephone": "+77071356701",
    "url": baseUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ул. Аспара, 7",
      "addressLocality": "Астана",
      "postalCode": "010000",
      "addressCountry": "KZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.197783,
      "longitude": 71.380555
    },
    // Дополнительный сигнал для карт (помогает связать сущность с локацией)
    "hasMap": "https://www.google.com/maps?q=51.197783,71.380555",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}