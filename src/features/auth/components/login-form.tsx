"use client";

import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, FlaskConical, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { loginSchema } from "../schemas";

const TEST_EMAIL = "teste@zetta.com.br";
const TEST_PASSWORD = "Zetta@2026";

/* ─── Ripple Button ────────────────────────────────────── */
function RippleButton({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement("span");
    span.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);
      transform:scale(0);animation:ripple-anim 0.55s ease-out forwards;
      pointer-events:none;width:120px;height:120px;
      left:${e.clientX - rect.left - 60}px;top:${e.clientY - rect.top - 60}px;`;
    btn.appendChild(span);
    setTimeout(() => span.remove(), 600);
  };
  return (
    <button
      ref={ref}
      type="submit"
      form="signin-form"
      onClick={!isLoading ? handleClick : undefined}
      disabled={isLoading}
      className="relative overflow-hidden flex w-full cursor-pointer items-center justify-center rounded-xl
        bg-primary text-primary-foreground py-3 font-bold shadow-lg shadow-primary/25
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35
        active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

/* ─── LoginForm ────────────────────────────────────────── */
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const fillTestCredentials = () => {
    form.setValue("email", TEST_EMAIL, { shouldDirty: true });
    form.setValue("password", TEST_PASSWORD, { shouldDirty: true });
    toast.info("Credenciais de teste preenchidas!");
  };

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await authClient.signIn.email(
        { email: data.email, password: data.password, callbackURL: "/" },
        {
          onSuccess: () => toast.success("Login realizado com sucesso!"),
          onError: (ctx) => {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            toast.error(ctx.error.message || "Credenciais inválidas. Tente novamente.");
          },
        },
      );
    } catch {
      throw new Error("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <span className="text-lg font-black text-white">Z</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Entrar na Zetta</h1>
        <p className="text-sm text-slate-500">
          Acesse sua conta para gerenciar reservas de sala.
        </p>
      </div>

      {/* Credenciais de teste */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <FlaskConical className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1">Usuário de teste</p>
              <p className="text-[11px] text-blue-600 font-mono leading-relaxed">
                {TEST_EMAIL}<br />
                {TEST_PASSWORD}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fillTestCredentials}
            className="flex-shrink-0 text-[11px] font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 
              border border-blue-200 px-2.5 py-1 rounded-lg transition-colors duration-150 whitespace-nowrap"
          >
            Preencher
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        id="signin-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-4 ${shake ? "animate-shake" : ""}`}
      >
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            E-mail
          </Label>
          <div className="relative">
            <Mail
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                focusedField === "email" ? "text-primary" : "text-slate-400"
              }`}
            />
            <InputForm
              id="email"
              type="email"
              placeholder="exemplo@zetta.com.br"
              error={form.formState.errors.email?.message}
              className="pl-10 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              {...form.register("email")}
            />
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                focusedField === "email" ? "w-full" : "w-0"
              }`}
            />
          </div>
        </div>

        {/* Senha */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">
            Senha
          </Label>
          <div className="relative">
            <Lock
              className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                focusedField === "password" ? "text-primary" : "text-slate-400"
              }`}
            />
            <InputForm
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={form.formState.errors.password?.message}
              className="pl-10 pr-10 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-primary transition-colors"
            >
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                focusedField === "password" ? "w-full" : "w-0"
              }`}
            />
          </div>
        </div>

        <RippleButton isLoading={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner className="size-5" /> : "Entrar"}
        </RippleButton>
      </form>

      <p className="text-center text-sm text-slate-500">
        Não tem uma conta?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
