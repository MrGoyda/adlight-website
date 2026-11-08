import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Быстрый пропуск для фоновых API, аналитики и публичных страниц
  if (
    pathname.startsWith("/api/") ||
    (!pathname.startsWith("/admin") && pathname !== "/login")
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Защитная проверка: если на Vercel еще не подтянулись переменные окружения
  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Быстрая проверка наличия сессионной куки Supabase перед сетевым запросом
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some((c) => c.name.includes("-auth-token"));

  if (!hasAuthCookie && pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Получаем сессию пользователя
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Защита админки: если не авторизован, редиректим на /login
    if (!user && pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Если авторизован и пытается зайти на /login, отправляем в CRM
    if (user && pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/leads";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("Middleware error:", err);
  }

  return supabaseResponse;
}
