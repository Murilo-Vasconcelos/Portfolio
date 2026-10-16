import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nunito, Oswald } from "next/font/google";
import { ThemeProvider } from "next-themes";
import CustomCursor from "@/components/CustomCursor";
import Intro from "@/components/Intro";
import { IntroProvider } from "@/components/IntroProvider";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import { hasLocale, htmlLang, locales } from "@/lib/i18n";
import { introScript } from "@/lib/intro";
import { siteUrl } from "@/lib/site";
import { getDictionary } from "./dictionaries";
import "../globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

// Gera as duas versões (/pt e /en) já prontas no build
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { "pt-BR": "/pt", "en-US": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: "Murilo Gomes",
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${lang}`,
      locale: lang === "pt" ? "pt_BR" : "en_US",
      alternateLocale: lang === "pt" ? ["en_US"] : ["pt_BR"],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={htmlLang[lang]}
      suppressHydrationWarning
      className={`${nunito.variable} ${oswald.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="bg-bg text-fg antialiased">
        {/* Sem JavaScript, nada fica escondido esperando animação */}
        <noscript>
          <style>{`.intro-overlay{display:none!important}[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <a
          href="#conteudo"
          className="fixed left-4 top-4 z-[400] -translate-y-20 rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg focus:translate-y-0"
        >
          {dict.header.skipToContent}
        </a>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <IntroProvider>
            <SmoothScroll>
              <Intro
                name={`${dict.hero.firstName} ${dict.hero.lastName}`}
                label={dict.intro.label}
                skipLabel={dict.intro.skip}
              />
              <ScrollProgress />
              <CustomCursor />
              {children}
            </SmoothScroll>
          </IntroProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
