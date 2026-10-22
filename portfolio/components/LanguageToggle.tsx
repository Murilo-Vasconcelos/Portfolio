"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { htmlLang, locales, type Locale } from "@/lib/i18n";

export default function LanguageToggle({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const pathname = usePathname();

  // Tira o /pt ou /en do começo do endereço, para montar o link do outro idioma
  const rest = pathname.replace(/^\/(pt|en)(?=\/|$)/, "");

  return (
    <nav
      aria-label={label}
      className="flex rounded-full border border-line p-0.5 text-xs font-semibold sm:text-sm"
    >
      {locales.map((code) => {
        const active = code === lang;
        return (
          <Link
            key={code}
            href={`/${code}${rest}`}
            scroll={false}
            lang={htmlLang[code]}
            hrefLang={htmlLang[code]}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-2.5 py-1.5 uppercase transition-colors sm:px-3 ${
              active ? "bg-fg text-bg" : "text-muted hover:text-fg"
            }`}
          >
            {code}
          </Link>
        );
      })}
    </nav>
  );
}
