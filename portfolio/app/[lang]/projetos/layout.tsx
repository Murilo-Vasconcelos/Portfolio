import { notFound } from "next/navigation";
import ApiErrorBoundary from "@/components/ApiErrorBoundary";
import Header from "@/components/Header";
import { profile } from "@/data/profile";
import { hasLocale } from "@/lib/i18n";
import { getDictionary } from "../dictionaries";

// Moldura das páginas de projeto: cabeçalho e a fronteira de erro da API.
// Se o GitHub falhar, a página inteira vira a tela de erro com "tentar de novo".
export default async function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dict={dict.header} base={`/${lang}`} />
      <main
        id="conteudo"
        className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40"
      >
        <ApiErrorBoundary
          dict={dict.projectsPage.error}
          profileUrl={profile.links.github}
        >
          {children}
        </ApiErrorBoundary>
      </main>
    </>
  );
}
