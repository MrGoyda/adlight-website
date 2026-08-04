"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { login } from "./actions";
import { triggerHaptic } from "@/lib/haptics";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    triggerHaptic("light");

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result && result.error) {
      setError(result.error);
      setIsLoading(false);
      triggerHaptic("light");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 overflow-hidden">
      {/* Пастельные фоновые неоновые круги для премиального блюра в стиле Apple */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-400 to-teal-300 opacity-10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
        className="relative w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/85 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-apple select-none"
      >
        <div className="text-center mb-8">
          <span className="text-sm font-bold tracking-wider text-orange-500 uppercase">
            Панель управления
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            ADLight CRM
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Войдите под своей учетной записью для доступа к финансам и аналитике
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-sm font-semibold text-red-600"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all disabled:opacity-50"
          >
            {isLoading ? "Вход..." : "Войти"}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
