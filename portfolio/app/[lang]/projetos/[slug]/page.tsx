import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectMedia from "@/components/ProjectMedia";
import TagList from "@/components/TagList";
import { findProjectBySlug, projectSlug, projects } from "@/data/projects";
import { formatDate } from "@/lib/format";
import { hasLocale } from "@/lib/i18n";
import { getRepo, listRepos } from "@/services/github";
import { getDictionary } from "../../dictionaries";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Gera no build a página de cada repositório. Se a API falhar no build,
// gera ao menos os projetos cadastrados à mão; os outros são gerados no
// primeiro acesso.
export async function generateStaticParams() {
  const result = await listRepos();
  const slugs = result.ok
    ? result.repos.map((repo) => repo.slug)
    : projects.map(projectSlug).filter((slug) => slug !== null);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const result = await listRepos();
  const repo = result.ok
    ? result.repos.find((item) => item.slug === slug)
    : undefined;
  const project = findProjectBySlug(slug);
  // Repositório que não existe: o título fica igual ao da página 404
  if (result.ok && !repo) return { title: dict.notFound.metaTitle };
  const name = project ? dict.projects.items[project.id].name : repo?.name;
  return {
    title: `${name ?? slug} | Murilo Gomes`,
    description: repo?.description ?? dict.projectsPage.metaDescription,
    alternates: {
      canonical: `/${lang}/projetos/${slug}`,
      languages: {
        "pt-BR": `/pt/projetos/${slug}`,
        "en-US": `/en/projetos/${slug}`,
      },
    },
  };
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line p-5">
      <dt className="font-display text-xs tracking-[0.25em] text-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 font-semibold">{children}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const page = dict.projectsPage;

  const repo = await getRepo(slug);
  if (!repo) notFound();

  // Projetos cadastrados à mão ganham imagem e os textos escritos no dicionário
  const project = findProjectBySlug(repo.slug);
  const text = project ? dict.projects.items[project.id] : null;
  const tags = repo.topics.length > 0 ? repo.topics : (project?.tech ?? []);

  return (
    <article>
      <Link
        href={`/${lang}/projetos`}
        className="text-sm font-semibold text-muted transition-colors hover:text-fg"
      >
        ← {page.backToList}
      </Link>

      <header className="mt-8">
        <p className="font-display text-sm tracking-[0.25em] text-muted uppercase">
          {text?.tag ?? repo.language}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,8vw,5.5rem)] leading-none font-bold [overflow-wrap:anywhere] uppercase">
          {text?.name ?? repo.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          {text?.summary ?? repo.description ?? page.noDescription}
        </p>
      </header>

      <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Fact label={page.language}>{repo.language ?? "—"}</Fact>
        <Fact label={page.updated}>
          <time dateTime={repo.updatedAt}>
            {formatDate(repo.updatedAt, lang)}
          </time>
        </Fact>
        <Fact label={page.stars}>{repo.stars}</Fact>
      </dl>

      {project && text && (
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xs tracking-[0.25em] text-muted uppercase">
                {dict.projects.partLabel}
              </h2>
              <p className="mt-1.5 leading-7">{text.part}</p>
            </div>
            <div>
              <h2 className="font-display text-xs tracking-[0.25em] text-muted uppercase">
                {dict.projects.learnedLabel}
              </h2>
              <p className="mt-1.5 leading-7">{text.learned}</p>
            </div>
          </div>
          {"imageAlt" in text && (
            <ProjectMedia
              image={project.image}
              alt={text.imageAlt}
              video={"video" in project ? project.video : undefined}
              webm={"videoWebm" in project}
            />
          )}
        </div>
      )}

      {tags.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 font-display text-xs tracking-[0.25em] text-muted uppercase">
            {page.topics}
          </h2>
          <TagList items={tags} />
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-fg bg-fg px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-transparent hover:text-fg"
        >
          {page.repoLink} ↗
        </a>
        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-fg"
          >
            {page.homepageLink} ↗
          </a>
        )}
      </div>
    </article>
  );
}
