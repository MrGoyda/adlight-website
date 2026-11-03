import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  const isLocal =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.startsWith("192.168.") ||
    host.startsWith("172.");

  const isCrmSubdomain = host.startsWith("crm.") || host.includes("crm.adlight.kz");

  // 1. Защита от дублирования SEO: 301 редирект с технических доменов vercel.app на основной домен
  if ((host.endsWith(".vercel.app") || host.includes("vercel.app")) && !isCrmSubdomain) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "adlight.kz";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // 2. Если пользователь на основном сайте adlight.kz пытается зайти в админку или логин:
  // перенаправляем его на выделенный субдомен crm.adlight.kz
  if (!isCrmSubdomain && !isLocal) {
    if (pathname.startsWith("/admin") || pathname === "/login") {
      const url = new URL(pathname + request.nextUrl.search, "https://crm.adlight.kz");
      return NextResponse.redirect(url, 307);
    }
  }

  // 3. Если запрос пришел на субдомен crm.adlight.kz:
  if (isCrmSubdomain) {
    // А. Если пытаются открыть лендинговые страницы сайта на субдомене crm (например, /services, /portfolio):
    const publicMarketingPrefixes = [
      "/services",
      "/portfolio",
      "/calculator",
      "/contacts",
      "/privacy",
      "/offer",
      "/design-code",
    ];
    if (publicMarketingPrefixes.some((p) => pathname.startsWith(p))) {
      const targetHost = isLocal ? host.replace(/^crm\./, "") : "adlight.kz";
      const targetProtocol = isLocal ? request.nextUrl.protocol : "https:";
      const url = new URL(pathname + request.nextUrl.search, `${targetProtocol}//${targetHost}`);
      return NextResponse.redirect(url, 301);
    }

    // Б. Если зашли в корень crm.adlight.kz/ -> редиректим на дашборд /admin/leads
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/leads";
      return NextResponse.redirect(url);
    }

    // В. Удобные короткие ссылки: /leads -> /admin/leads, /finance -> /admin/finance и т.д.
    const crmShortcuts = [
      "/leads",
      "/finance",
      "/projects",
      "/analytics",
      "/clients",
      "/companies",
      "/warehouse",
      "/pricing",
      "/clicks",
    ];
    const matchedShortcut = crmShortcuts.find(
      (s) => pathname === s || pathname.startsWith(s + "/")
    );
    if (matchedShortcut) {
      const url = request.nextUrl.clone();
      url.pathname = `/admin${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Применяем middleware ко всем путям, кроме статических файлов, картинок и favicon
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
