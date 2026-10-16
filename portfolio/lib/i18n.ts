export const locales = ["pt", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

// Valor do atributo lang do <html> para cada idioma
export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
