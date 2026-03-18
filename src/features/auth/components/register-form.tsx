import { InputForm } from "@/components/ui/input-form";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Register } from "../actions";
import { registerSchema } from "../schemas";

/* ─── Botão com ripple ─────────────────────────────────── */
function RippleButton({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);
      transform:scale(0);animation:ripple-anim 0.55s ease-out forwards;
      pointer-events:none;width:120px;height:120px;
      left:${e.clientX - rect.left - 60}px;top:${e.clientY - rect.top - 60}px;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <button
      ref={btnRef}
      type="submit"
      form="register-form"
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

/* ─── Campo com ícone e focus state ───────────────────── */
function FancyField({
  id, label, type, icon, error, rightElement, registration, placeholder,
}: {
  id: string; label: string; type: string;
  icon: React.ReactNode; error?: string;
  rightElement?: React.ReactNode;
  registration: object; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</Label>
      <div className="relative group">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? "text-primary" : "text-slate-400"}`}>
          {icon}
        </div>
        <InputForm
          id={id}
          type={type}
          placeholder={placeholder}
          error={error}
          className="pl-10 pr-10 transition-all duration-200 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...(registration as object)}
        />
        <div className={`absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${focused ? "w-full opacity-100" : "w-0 opacity-0"}`} />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
    </div>
  );
}

/* ─── Password strength meter ─────────────────────────── */
function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const labels = ["", "Fraca", "Razoável", "Boa", "Forte"];
  const colors = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const textColors = ["", "text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-slate-200"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium transition-colors duration-200 ${textColors[strength]}`}>
        Força da senha: {labels[strength]}
      </p>
    </div>
  );
}

/* ─── RegisterForm ───────────────────────────────────────*/
const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const response = await Register(data);
    if (response.error) { toast.error(response.error); return; }
    toast.success("Cadastro realizado com sucesso!");
    form.reset();
    setTimeout(() => {
      toast.info("Redirecionando para o login...");
      navigate("/auth/login");
    }, 3000);
  };

  return (
    <div className="space-y-7">
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <span className="text-base font-black text-white">Z</span>
          </div>
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Zetta Calendar</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Criar conta na Zetta</h1>
        <p className="text-slate-500 text-sm">Preencha seus dados para acessar a plataforma.</p>
      </header>

      <form id="register-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FancyField
          id="name" label="Nome" type="text"
          icon={<User className="h-4 w-4" />}
          placeholder="Digite seu nome"
          error={form.formState.errors.name?.message}
          registration={form.register("name")}
        />
        <FancyField
          id="email" label="E-mail" type="email"
          icon={<Mail className="h-4 w-4" />}
          placeholder="exemplo@zetta.com.br"
          error={form.formState.errors.email?.message}
          registration={form.register("email")}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FancyField
              id="password" label="Senha"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="h-4 w-4" />}
              placeholder="••••••••"
              error={form.formState.errors.password?.message}
              registration={{
                ...form.register("password"),
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  form.register("password").onChange(e);
                  setPasswordValue(e.target.value);
                },
              }}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              }
            />
            <PasswordStrengthMeter password={passwordValue} />
          </div>

          <FancyField
            id="confirmPassword" label="Confirmar senha"
            type={showConfirmPassword ? "text" : "password"}
            icon={<Lock className="h-4 w-4" />}
            placeholder="••••••••"
            error={form.formState.errors.confirmPassword?.message}
            registration={form.register("confirmPassword")}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1.5 text-slate-400 hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            }
          />
        </div>

        <p className="text-[11px] text-slate-400">
          Ao criar sua conta, você concorda com os{" "}
          <Link to="#" className="text-primary hover:underline">Termos de Serviço</Link>
          {" "}e a{" "}
          <Link to="#" className="text-primary hover:underline">Política de Privacidade</Link>.
        </p>

        <RippleButton isLoading={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner className="size-5" /> : "Criar conta"}
        </RippleButton>
      </form>

      <p className="text-center text-sm text-slate-600">
        Já possui uma conta?{" "}
        <Link to="/auth/login" className="font-bold text-primary underline-offset-4 hover:underline transition-colors">
          Fazer login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
