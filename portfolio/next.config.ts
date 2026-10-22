import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Esconde o botão "N" do Next.js que aparece no canto durante o desenvolvimento
  // (ele nunca aparece no site publicado).
  devIndicators: false,
  images: {
    // 75 é o padrão; 90 só para a foto do perfil, que precisa de mais nitidez
    qualities: [75, 90],
  },
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
