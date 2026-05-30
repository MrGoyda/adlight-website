import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // Защита от кликджекинга (встраивания во фреймы)
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Защита от MIME-sniffing
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block", // Защита от XSS-атак в старых браузерах
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // Конфиденциальность реферера
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()", // Полное отключение доступа к датчикам на уровне браузера
          },
        ],
      },
    ];
  },
};

export default nextConfig;
