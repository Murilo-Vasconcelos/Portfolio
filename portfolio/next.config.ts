import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Esconde o botão "N" do Next.js que aparece no canto durante o desenvolvimento
  // (ele nunca aparece no site publicado).
  devIndicators: false,
  // Permite exibir a foto do hero em qualidade 90 (o padrão do Next 16 é só 75)
  images: { qualities: [75, 90] },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
