import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      allowedOrigins: [
        "172.20.10.5:3000",
        "172.20.10.1:3000",
        "172.20.10.2:3000",
        "172.20.10.3:3000",
        "172.20.10.4:3000",
        "172.20.10.5",
        "192.168.0.15:3000",
        "192.168.0.15",
        "localhost:3000",
        "127.0.0.1:3000",
      ],
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.adlight.kz",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
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
