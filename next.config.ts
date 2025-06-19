import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desativa otimizações que usam o binding nativo do lightningcss
  experimental: {
    optimizeCss: false,
    optimizeFonts: false,
  },

  // ...outras opções que você já tinha
};

export default nextConfig;
