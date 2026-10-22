import Link from "next/link";
import { Suspense } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import ApiErrorBoundary from "@/components/ApiErrorBoundary";
import LatestRepos from "@/components/LatestRepos";
import ProjectMedia from "@/components/ProjectMedia";
import Reveal from "@/components/Reveal";
import SectionShell from "@/components/SectionShell";
import RepoGridSkeleton from "@/components/RepoGridSkeleton";
import TagList from "@/components/TagList";
import TiltCard from "@/components/TiltCard";
import { profile } from "@/data/profile";
import { projects, reviTeam } from "@/data/projects";
import type { Locale } from "@/lib/i18n";

type Dict = Dictionary["projects"];
type Project = (typeof projects)[number];

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-display text-xs tracking-[0.25em] text-muted uppercase">
        {label}
      </p>
      <p className="mt-1.5 leading-7">{text}</p>
    </div>
  );
}

// Link que cobre o card inteiro (o clique funciona em qualquer parte dele)
function CodeLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold after:absolute after:inset-0 after:rounded-3xl after:content-['']"
    >
      <span className="underline decoration-line decoration-2 underline-offset-4">
        {label}
      </span>
      ↗
    </a>
  );
}

function FeaturedProject({ project, dict }: { project: Project; dict: Dict }) {
  const text = dict.items[project.id];

  return (
    <Reveal>
      <TiltCard
        maxTilt={2.5}
        label={project.repo ? dict.codeLabel : undefined}
        className="rounded-3xl border border-fg bg-surface p-7 sm:p-10"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-fg px-3 py-1 font-display text-xs tracking-[0.25em] text-bg uppercase">
                {dict.featuredLabel}
              </span>
              <span className="font-display text-sm tracking-[0.2em] text-muted uppercase">
                {text.tag}
              </span>
            </div>

            <h3 className="font-display text-5xl leading-none font-bold [overflow-wrap:anywhere] uppercase sm:text-8xl">
              {text.name}
            </h3>
            <p className="font-semibold">{text.status}</p>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              {text.summary}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Detail label={dict.partLabel} text={text.part} />
              <Detail label={dict.learnedLabel} text={text.learned} />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:border-l lg:border-line lg:pl-10">
            {"image" in project && "imageAlt" in text && (
              <ProjectMedia
                image={project.image}
                alt={text.imageAlt}
                video={"video" in project ? project.video : undefined}
                webm={"videoWebm" in project}
              />
            )}
            <div>
              <p className="font-display text-xs tracking-[0.25em] text-muted uppercase">
                {dict.teamLabel}
              </p>
              <ul className="mt-3 space-y-2">
                {reviTeam.map((member) => (
                  <li key={member.name}>
                    {member.url ? (
                      <a
                        href={member.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${dict.teamAria} ${member.name}`}
                        className="relative z-10 inline-flex items-center gap-2 font-semibold underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-fg"
                      >
                        {member.name} <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      <span className="font-semibold">
                        {member.name}{" "}
                        <span className="font-normal text-muted">
                          ({dict.meLabel})
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <TagList items={project.tech} />

            {project.repo ? (
              <CodeLink href={project.repo} label={dict.codeLabel} />
            ) : (
              <p className="mt-auto inline-flex w-fit rounded-full border border-dashed border-fg px-4 py-2 text-sm font-semibold">
                {dict.codeSoon}
              </p>
            )}
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function ProjectCard({
  project,
  dict,
  delay,
}: {
  project: Project;
  dict: Dict;
  delay: number;
}) {
  const text = dict.items[project.id];

  return (
    <Reveal delay={delay}>
      <TiltCard
        label={project.repo ? dict.codeLabel : undefined}
        className="flex min-w-0 flex-col gap-5 rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-fg"
      >
        {"image" in project && "imageAlt" in text && (
          <ProjectMedia
            image={project.image}
            alt={text.imageAlt}
            video={"video" in project ? project.video : undefined}
            webm={"videoWebm" in project}
          />
        )}
        <p className="font-display text-xs tracking-[0.2em] text-muted uppercase">
          {text.tag}
        </p>
        <h3 className="font-display text-2xl leading-tight font-bold [overflow-wrap:anywhere] uppercase sm:text-3xl">
          {text.name}
        </h3>
        <p className="text-sm font-semibold">{text.status}</p>
        <p className="leading-7 text-muted">{text.summary}</p>
        <Detail label={dict.partLabel} text={text.part} />
        <Detail label={dict.learnedLabel} text={text.learned} />
        <TagList items={project.tech} />
        {project.repo && (
          <CodeLink href={project.repo} label={dict.codeLabel} />
        )}
      </TiltCard>
    </Reveal>
  );
}

export default function Projects({
  dict,
  page,
  lang,
}: {
  dict: Dict;
  page: Dictionary["projectsPage"];
  lang: Locale;
}) {
  const featured = projects.find((project) => project.featured);
  const others = projects.filter((project) => !project.featured);

  return (
    <SectionShell
      id="projetos"
      index={dict.index}
      title={dict.title}
      intro={dict.intro}
    >
      <div className="space-y-6">
        {featured && <FeaturedProject project={featured} dict={dict} />}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {others.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              dict={dict}
              delay={0.1 * index}
            />
          ))}
        </div>
      </div>

      {/* Repositórios vindos da API do GitHub, com esqueleto e tela de erro */}
      <div className="mt-20 sm:mt-24">
        <Reveal>
          <h3 className="font-display text-3xl font-bold uppercase sm:text-5xl">
            {dict.github.title}
          </h3>
          <p className="mt-3 mb-8 max-w-xl text-lg leading-8 text-muted">
            {dict.github.intro}
          </p>
        </Reveal>
        <ApiErrorBoundary dict={page.error} profileUrl={profile.links.github}>
          <Suspense
            fallback={<RepoGridSkeleton count={4} label={page.loading} />}
          >
            <LatestRepos lang={lang} dict={page} />
          </Suspense>
        </ApiErrorBoundary>
        <Link
          href={`/${lang}/projetos`}
          className="mt-8 inline-block rounded-full border border-fg px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-fg hover:text-bg"
        >
          {dict.github.seeAll} →
        </Link>
      </div>
    </SectionShell>
  );
}
