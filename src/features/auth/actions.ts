import { supabase } from "@/lib/supabase";
import z from "zod";
import { loginSchema, registerSchema } from "./schemas";

export async function Login(data: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Falha ao fazer login, verifique os dados digitados" };
  }

  const { email, password } = validatedFields.data as { email: string; password: string };
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "Email ou senha incorretos" };
  return { success: true };
}

export async function Register(data: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Falha ao criar conta, verifique os dados digitados" };
  }

  const { name, email, password } = validatedFields.data as { name: string; email: string; password: string; confirmPassword: string };

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return { error: error.message || "Erro ao criar conta" };

  if (authData.user) {
    await supabase.from("profiles").upsert({
      id: authData.user.id,
      name,
      email,
      role: "USER",
    });
  }

  return { success: true };
}


