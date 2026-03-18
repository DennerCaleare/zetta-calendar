import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useSession } from "@/contexts/auth-context";
import Footer from "@/components/footer";
import Header from "@/components/header";
import LoginForm from "@/features/auth/components/login-form";
import RegisterForm from "@/features/auth/components/register-form";
import DashboardPage from "@/pages/DashboardPage";
import SettingsPage from "@/pages/SettingsPage";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

/* ─── Auth Layout ────────────────────────────────────── */
function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 pointer-events-none" />
      <div
        className="fixed top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(226,71%,55% / 0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <Link
        className="fixed top-6 left-6 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-100 text-slate-400 hover:text-primary hover:scale-110 active:scale-95 transition-all duration-200"
        title="Voltar"
        to="/"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>
      <section className="relative z-10 w-full max-w-sm px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100/80 p-8">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

/* ─── Protected Layout ───────────────────────────────── */
function ProtectedLayout() {
  const { data, isPending } = useSession();
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  if (!data) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* ─── Root redirect ──────────────────────────────────── */
function RootRedirect() {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  return <Navigate to={data ? "/dashboard" : "/auth/login"} replace />;
}

/* ─── App ────────────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
