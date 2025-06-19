import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false,
    // optimizeFonts já removido
  },
  typescript: {
    // ignora TODOS os erros de TS na hora do build
    ignoreBuildErrors: true,
  },
  // ... outras configurações
};

export default nextConfig;
