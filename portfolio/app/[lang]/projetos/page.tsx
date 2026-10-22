import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EmptyState from "@/components/EmptyState";
import RepoCard from "@/components/RepoCard";
import RepoGridSkeleton from "@/components/RepoGridSkeleton";
import { profile } from "@/data/profile";
import { hasLocale, type Locale } from "@/lib/i18n";
import { getRepos } from "@/services/github";
import { getDictionary, type Dictionary } from "../dictionaries";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang)).projectsPage;
  return {
    title: dict.metaTitle,
    description: dict.metaDescription,
    alternates: {
      canonical: `/${lang}/projetos`,
      languages: { "pt-BR": "/pt/projetos", "en-US": "/en/projetos" },
    },
  };
}

async function RepoList({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["projectsPage"];
}) {
  const repos = await getRepos();

  if (repos.length === 0) {
    return (
      <EmptyState
        title={dict.empty.title}
        text={dict.empty.text}
        action={{ href: profile.links.github, label: dict.empty.profile }}
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {repos.map((repo) => (
        <RepoCard key={repo.slug} repo={repo} lang={lang} dict={dict} />
      ))}
    </ul>
  );
}

export default async function ProjectsPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang)).projectsPage;

  return (
    <>
      <Link
        href={`/${lang}#projetos`}
        className="text-sm font-semibold text-muted transition-colors hover:text-fg"
      >
        ← {dict.back}
      </Link>
      <div className="mt-8 mb-12 sm:mb-16">
        <p className="font-display text-sm tracking-[0.3em] text-muted uppercase">
          {dict.index} /
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,10vw,6.5rem)] leading-none font-bold uppercase">
          {dict.title}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          {dict.intro}
        </p>
      </div>

      {/* O título já vai no HTML; só a lista espera a API */}
      <Suspense fallback={<RepoGridSkeleton count={6} label={dict.loading} />}>
        <RepoList lang={lang} dict={dict} />
      </Suspense>
    </>
  );
}
