import { supabase } from "@/lib/supabase";
import type { Profile, UserRole } from "@/types/database";
import z from "zod";
import { createUserSchema } from "./schemas";

async function requireAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autorizado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "ADMIN") throw new Error("Não autorizado");
}

export async function getUsers(): Promise<Profile[]> {
  await requireAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .order("name");

  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function createUser(data: z.infer<typeof createUserSchema>) {
  await requireAdmin();

  const validatedFields = createUserSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: "Falha ao criar usuário, verifique os dados digitados" };
  }

  const { name, email, password, role } = validatedFields.data;
  if (!password) {
    return { error: "Falha ao criar usuário, verifique os dados digitados" };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (authError) return { error: "Erro ao criar usuário" };

  if (authData.user) {
    await supabase.from("profiles").upsert({
      id: authData.user.id,
      name,
      email,
      role,
    });
  }

  return { success: true };
}

export async function updateUser(
  id: string,
  data: { name: string; email: string; role: UserRole },
) {
  await requireAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ name: data.name, email: data.email, role: data.role })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteUser(id: string) {
  await requireAdmin();

  // Deletes the profile; the auth.users record must be removed via Supabase dashboard or admin API
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}

