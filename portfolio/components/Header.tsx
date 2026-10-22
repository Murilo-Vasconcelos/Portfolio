import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import type { Locale } from "@/lib/i18n";

type HeaderDict = {
  themeToLight: string;
  themeToDark: string;
  langAria: string;
  home: string;
  navAria: string;
  nav: {
    journey: string;
    experience: string;
    projects: string;
    skills: string;
    certifications: string;
    contact: string;
  };
};

// Fora da home, `base` (ex.: "/pt") faz os links das seções voltarem para
// a home; na home ele fica vazio para a rolagem suave dos #links funcionar.
export default function Header({
  lang,
  dict,
  base = "",
}: {
  lang: Locale;
  dict: HeaderDict;
  base?: string;
}) {
  const links = [
    { href: `${base}#jornada`, label: dict.nav.journey },
    { href: `${base}#experiencia`, label: dict.nav.experience },
    { href: `${base}#projetos`, label: dict.nav.projects },
    { href: `${base}#skills`, label: dict.nav.skills },
    { href: `${base}#certificacoes`, label: dict.nav.certifications },
    { href: `${base}#contato`, label: dict.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 bg-bg/70 px-4 py-4 backdrop-blur-md sm:gap-4 sm:px-8">
      <a
        href={`${base}#inicio`}
        className="font-display text-xl font-bold tracking-wider"
      >
        {/* O nome acessível começa pelo texto visível ("MG") */}
        MG<span className="sr-only"> · {dict.home}</span>
      </a>

      {/* Menu só aparece em telas largas */}
      <nav aria-label={dict.navAria} className="hidden xl:block">
        <ul className="flex items-center gap-7 font-display text-sm tracking-[0.15em] uppercase">
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
          }}
        />
      </div>
    </header>
  );
}
