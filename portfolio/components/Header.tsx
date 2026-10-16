import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import type { Locale } from "@/lib/i18n";

type HeaderDict = {
  themeToLight: string;
  themeToDark: string;
  themeAria: string;
  langAria: string;
  home: string;
  navAria: string;
  nav: {
    journey: string;
    experience: string;
    projects: string;
    skills: string;
    certifications: string;
    milestones: string;
    contact: string;
  };
};

export default function Header({
  lang,
  dict,
}: {
  lang: Locale;
  dict: HeaderDict;
}) {
  const links = [
    { href: "#jornada", label: dict.nav.journey },
    { href: "#experiencia", label: dict.nav.experience },
    { href: "#projetos", label: dict.nav.projects },
    { href: "#skills", label: dict.nav.skills },
    { href: "#certificacoes", label: dict.nav.certifications },
    { href: "#marcos", label: dict.nav.milestones },
    { href: "#contato", label: dict.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 bg-bg/70 px-4 py-4 backdrop-blur-md sm:gap-4 sm:px-8">
      <a
        href="#inicio"
        aria-label={dict.home}
        className="font-display text-xl font-bold tracking-wider"
      >
        MG
      </a>

      {/* Menu só aparece em telas largas */}
      <nav aria-label={dict.navAria} className="hidden xl:block">
        <ul className="flex items-center gap-7 font-display text-sm uppercase tracking-[0.15em]">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="-my-2 block py-2 text-muted transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageToggle lang={lang} label={dict.langAria} />
        <ThemeToggle
          labels={{
            toLight: dict.themeToLight,
            toDark: dict.themeToDark,
            aria: dict.themeAria,
          }}
        />
      </div>
    </header>
  );
}
