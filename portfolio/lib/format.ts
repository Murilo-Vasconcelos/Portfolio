import { htmlLang, type Locale } from "@/lib/i18n";

// Data no formato de cada idioma: "22 de out. de 2026" ou "Oct 22, 2026"
export function formatDate(date: string, lang: Locale) {
  return new Intl.DateTimeFormat(htmlLang[lang], {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));
}
