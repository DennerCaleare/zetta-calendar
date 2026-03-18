import "dotenv/config";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

/**
 * Seed de usuário de teste para desenvolvimento.
 * Cria o usuário teste@zetta.com.br com senha Zetta@2026
 * usando a API do BetterAuth para garantir compatibilidade de hash.
 */
async function main() {
  console.log("🌱 Criando usuário de teste...");

  const email = "teste@zetta.com.br";
  const password = "Zetta@2026";
  const name = "Usuário Teste";

  // Verifica se o usuário já existe e remove para recriar com hash correto
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log("🔄 Usuário já existe. Removendo para recriar com hash correto...");
    await db.account.deleteMany({ where: { userId: existing.id } });
    await db.session.deleteMany({ where: { userId: existing.id } });
    await db.user.delete({ where: { email } });
  }

  // Usa a API do BetterAuth para criar o usuário com hash compatível
  const result = await auth.api.signUpEmail({
    body: { name, email, password },
  });

  if (!result || result.user == null) {
    throw new Error("Falha ao criar usuário via BetterAuth.");
  }

  console.log("✅ Usuário de teste criado com sucesso!");
  console.log("   📧 Email:", email);
  console.log("   🔑 Senha:", password);
  console.log("   🆔 ID:", result.user.id);

  await db.$disconnect();
}

main().catch((e) => {
  console.error("❌ Erro ao criar usuário de teste:", e);
  process.exit(1);
});
