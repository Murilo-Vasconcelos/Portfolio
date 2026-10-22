import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import FeaturedSection from "@/components/dashboard/FeaturedSection";
import ListSkeleton from "@/components/dashboard/ListSkeleton";
import MessageList from "@/components/dashboard/MessageList";
import PanelErrorBoundary from "@/components/dashboard/PanelErrorBoundary";
import PanelHeader from "@/components/dashboard/PanelHeader";
import { hasLocale, type Locale } from "@/lib/i18n";
import { getCurrentUser } from "@/services/auth";
import { getDictionary, type Dictionary } from "../../dictionaries";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.panel.dashboard.metaTitle, robots: { index: false } };
}

function Section({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10">
      <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 mb-8 max-w-xl leading-7 text-muted">{intro}</p>
      {children}
    </section>
  );
}

// Tudo que depende do login fica aqui dentro, atrás do <Suspense>: com Cache
// Components, ler a sessão (cookies) fora de um Suspense é erro de build, e
// assim o título do painel aparece na hora enquanto o resto carrega.
async function Dashboard({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const user = await getCurrentUser(lang);
  const text = dict.panel.dashboard;

  return (
    <>
      <p className="mt-5 text-muted">
        {text.signedInAs}{" "}
        <strong className="[overflow-wrap:anywhere] text-fg">
          {user.email}
        </strong>
      </p>

      <div className="mt-12 space-y-16">
        <Section title={text.messages.title} intro={text.messages.intro}>
          <PanelErrorBoundary dict={text.error}>
            <Suspense fallback={<ListSkeleton label={text.messages.loading} />}>
              <MessageList lang={lang} dict={text.messages} />
            </Suspense>
          </PanelErrorBoundary>
        </Section>

        <Section title={text.featured.title} intro={text.featured.intro}>
          <PanelErrorBoundary dict={text.error}>
            <Suspense
              fallback={<ListSkeleton label={text.featured.loading} rows={2} />}
            >
              <FeaturedSection dict={text.featured} />
            </Suspense>
          </PanelErrorBoundary>
        </Section>
      </div>
    </>
  );
}

export default async function DashboardPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const text = dict.panel.dashboard;

  return (
    <>
      {/* O proxy só deixa chegar aqui quem está logado, então o botão de
          sair já vai no HTML estático */}
      <PanelHeader
        lang={lang}
        dict={dict.panel.header}
        header={dict.header}
        showLogout
      />
      <p className="font-display text-sm tracking-[0.3em] text-muted uppercase">
        {text.index} /
      </p>
      <h1 className="mt-3 font-display text-[clamp(2.5rem,10vw,6.5rem)] leading-none font-bold uppercase">
        {text.title}
      </h1>
      <Suspense fallback={<ListSkeleton label={text.loading} rows={2} />}>
        <Dashboard lang={lang} dict={dict} />
      </Suspense>
    </>
  );
}
