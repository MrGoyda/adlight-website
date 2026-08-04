"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit, registerFailedAttempt, resetRateLimit } from "@/lib/rateLimit";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Пожалуйста, заполните все поля" };
  }

  // Получаем IP адрес для уникального ключа ограничения попыток
  const headerList = await headers();
  const clientIp = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "anonymous-ip";
  const rateLimitKey = `login-limit:${clientIp}:${email.toLowerCase().trim()}`;

  // Проверяем лимит
  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.success) {
    return { error: rateCheck.error };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    registerFailedAttempt(rateLimitKey);
    return { error: "Неверный логин или пароль" };
  }

  // Успешный вход — сбрасываем попытки
  resetRateLimit(rateLimitKey);

  redirect("/admin/leads");
}
