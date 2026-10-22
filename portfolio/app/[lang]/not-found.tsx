import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import Header from "@/components/Header";
import { defaultLocale, hasLocale } from "@/lib/i18n";
import { getDictionary } from "./dictionaries";

// Página 404 do site: endereço que não existe ou projeto que não está no
// GitHub. O not-found não recebe params, então o idioma vem do root-params.
export default async function NotFound() {
  const value = await rootLang();
  const lang = hasLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(lang);
  const text = dict.notFound;

  return (
    <>
      {/* O React leva o <title> para o <head> */}
      <title>{text.metaTitle}</title>
      <Header lang={lang} dict={dict.header} base={`/${lang}`} />
      <main
        id="conteudo"
        className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 py-32 sm:px-8"
      >
        <p
          aria-hidden
          className="text-outline font-display text-[clamp(6rem,30vw,16rem)] leading-none font-bold"
        >
          {text.code}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold uppercase sm:text-6xl">
          {text.title}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          {text.text}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={`/${lang}`}
            className="rounded-full border border-fg bg-fg px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-transparent hover:text-fg"
          >
            {text.home}
          </Link>
          <Link
            href={`/${lang}/projetos`}
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-fg"
          >
            {text.projects}
          </Link>
        </div>
      </main>
    </>
  );
}
