import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Necessário para o BetterAuth funcionar no Vercel (Edge + Node runtime)
  serverExternalPackages: ["@node-rs/argon2", "@node-rs/bcrypt"],
};

export default nextConfig;
