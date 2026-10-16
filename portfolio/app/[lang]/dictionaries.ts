import type { Locale } from "@/lib/i18n";
import type pt from "./dictionaries/pt.json";

// O formato do dicionário em português é o modelo: se faltar uma chave no
// inglês, o TypeScript avisa na hora.
export type Dictionary = typeof pt;

const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  pt: () => import("./dictionaries/pt.json"),
  en: () => import("./dictionaries/en.json"),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (await dictionaries[locale]()).default;
}
