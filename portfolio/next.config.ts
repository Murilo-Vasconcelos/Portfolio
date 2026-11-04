import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// A barra de comentários da Vercel só aparece nas prévias dos PRs e carrega
// script, estilo, imagem, fonte e tempo real de fora; no site publicado nada
// disso é liberado
const preview = process.env.VERCEL_ENV === "preview";
const live = (origins: string) => (preview ? ` ${origins}` : "");

// Política de conteúdo: só carrega script, imagem, fonte e mídia do próprio
// site, não deixa outro site abrir este num iframe (clickjacking) e só envia
// formulário para o próprio site. Sem nonce, porque nonce obrigaria a gerar
// toda página na hora e perder o HTML estático (veja o guia de CSP do Next);
// por isso o 'unsafe-inline', que o Next e o Framer Motion precisam.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${live("https://vercel.live")}`,
  `style-src 'self' 'unsafe-inline'${live("https://vercel.live")}`,
  `img-src 'self' blob: data:${live("https://vercel.live https://vercel.com")}`,
  `font-src 'self'${live("https://vercel.live https://assets.vercel.com")}`,
  `connect-src 'self'${live("https://vercel.live wss://ws-us3.pusher.com")}`,
  `frame-src 'self'${live("https://vercel.live")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

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
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
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
