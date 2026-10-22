import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import LanguageToggle from "@/components/LanguageToggle";
import LogoutButton from "@/components/dashboard/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import type { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  dict: Dictionary["panel"]["header"];
  header: Dictionary["header"];
  showLogout?: boolean;
};

// Cabeçalho do painel: o mesmo visual do site (logo, idioma e tema), sem o
// menu das seções e com o botão de sair.
export default function PanelHeader({ lang, dict, header, showLogout }: Props) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 bg-bg/70 px-4 py-4 backdrop-blur-md sm:gap-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Link
          href={`/${lang}`}
          className="font-display text-xl font-bold tracking-wider"
        >
          MG<span className="sr-only"> · {dict.home}</span>
        </Link>
        <span className="rounded-full border border-line px-2.5 py-1 font-display text-xs tracking-[0.2em] text-muted uppercase">
          {dict.label}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageToggle lang={lang} label={header.langAria} />
        <ThemeToggle
          labels={{ toLight: header.themeToLight, toDark: header.themeToDark }}
        />
        {showLogout && (
          <LogoutButton
            lang={lang}
            label={dict.logout}
            pendingLabel={dict.loggingOut}
          />
        )}
      </div>
    </header>
  );
}
