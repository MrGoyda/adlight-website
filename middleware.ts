import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // 1. Защита от дублирования SEO: 301 редирект с технических доменов vercel.app на основной домен
  if (host.endsWith(".vercel.app") || host.includes("vercel.app")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "adlight.kz";
    url.port = "";
    return NextResponse.redirect(url, 301);
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
