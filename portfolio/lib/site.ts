// Endereço público do site, usado em sitemap, robots e nas prévias de link.
// Na Vercel ele é descoberto sozinho. Se você comprar um domínio próprio,
// crie a variável NEXT_PUBLIC_SITE_URL (ex.: https://murilogomes.dev) nas
// configurações do projeto na Vercel.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");
