export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ADLight",
    "image": "https://adlight.kz/logo.png",
    "telephone": "+77071356701",
    "url": "https://adlight.kz",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Улица (укажи реальную)", 
      "addressLocality": "Астана",
      "postalCode": "010000",
      "addressCountry": "KZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.1605, // Укажи точные координаты цеха
      "longitude": 71.4704
    },
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