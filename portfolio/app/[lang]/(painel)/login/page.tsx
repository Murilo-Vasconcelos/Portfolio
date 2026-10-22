import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LoginForm from "@/components/dashboard/LoginForm";
import PanelHeader from "@/components/dashboard/PanelHeader";
import { hasLocale } from "@/lib/i18n";
import { getDictionary } from "../../dictionaries";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  // Página privada: fora dos buscadores
  return { title: dict.panel.login.metaTitle, robots: { index: false } };
}

export default async function LoginPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const text = dict.panel.login;

  return (
    <>
      <PanelHeader lang={lang} dict={dict.panel.header} header={dict.header} />
      <div className="mx-auto max-w-md">
        <p className="font-display text-sm tracking-[0.3em] text-muted uppercase">
          {text.index} /
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,10vw,5rem)] leading-none font-bold uppercase">
          {text.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">{text.intro}</p>
        <div className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <LoginForm lang={lang} dict={text} />
        </div>
      </div>
    </>
  );
}
