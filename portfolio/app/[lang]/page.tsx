import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Journey from "@/components/sections/Journey";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import { hasLocale } from "@/lib/i18n";
import { getDictionary } from "./dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dict={dict.header} />

      <main id="conteudo">
        <Hero dict={dict.hero} />
        <Journey dict={dict.journey} />
        <Experience dict={dict.experience} />
        <Projects dict={dict.projects} />
        <Skills dict={dict.skills} />
        <Certifications dict={dict.certifications} />
        <Contact dict={dict.contact} hero={dict.hero} />
      </main>
    </>
  );
}
