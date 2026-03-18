"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/* ─── Layout de Auth ──────────────────────────────────── */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50">
      {/* Gradiente sutil de fundo */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 pointer-events-none" />

      {/* Orbe decorativo — centro-alto */}
      <div
        className="fixed top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(226,71%,55% / 0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Botão voltar */}
      <Link
        className="fixed top-6 left-6 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-100 text-slate-400 hover:text-primary hover:scale-110 active:scale-95 transition-all duration-200"
        title="Voltar"
        href="/"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {/* Card central do formulário */}
      <section className="relative z-10 w-full max-w-sm px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100/80 p-8">
          {children}
        </div>
      </section>
    </main>
  );
}
