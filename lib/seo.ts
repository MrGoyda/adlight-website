import { Metadata } from "next";

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  keywords?: string[];
}

export function constructMetadata({
  title = "ADLight — Наружная реклама в Астане | Вывески от производителя",
  description = "Профессиональное изготовление объемных букв, световых коробов, неоновых вывесок и рекламных конструкций в Астане. Собственное производство, согласование с Акиматом, гарантия.",
  image = "/images/pages/services-lightboxes.webp",
  icons = "/icon.png",
  noIndex = false,
  canonicalUrl = "https://adlight.kz",
  keywords = [
    "наружная реклама астана",
    "изготовление вывесок астана",
    "объемные буквы астана",
    "световые короба астана",
    "неоновые вывески астана",
    "согласование рекламы астана",
    "ADLight"
  ]
}: ConstructMetadataProps = {}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ADLight",
      images: [
        {
          url: image,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL("https://adlight.kz"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
