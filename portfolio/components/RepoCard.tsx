import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import type { Repo } from "@/services/github";

// Card de um repositório do GitHub; o card inteiro leva para a página do
// projeto. prefetch carrega a página certa antes do clique (não só o esqueleto).
// O nível do título depende da página: h2 logo abaixo do h1 em /projetos, h3
// dentro da seção Projetos da home (leitores de tela navegam por títulos).
export default function RepoCard({
  repo,
  lang,
  dict,
  headingLevel = "h3",
}: {
  repo: Repo;
  lang: Locale;
  dict: Dictionary["projectsPage"];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <li>
      <Link
        href={`/${lang}/projetos/${repo.slug}`}
        prefetch
        className="flex h-full flex-col gap-4 rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-fg"
      >
        <div className="flex items-center justify-between gap-3 font-display text-xs tracking-[0.2em] text-muted uppercase">
          <span>{repo.language}</span>
          {repo.stars > 0 && (
            <span>
              <span aria-hidden>★</span> {repo.stars}
              <span className="sr-only"> {dict.stars}</span>
            </span>
          )}
        </div>
        <Heading className="font-display text-2xl leading-tight font-bold [overflow-wrap:anywhere] uppercase">
          {repo.name}
        </Heading>
        <p className="line-clamp-3 leading-7 text-muted">
          {repo.description ?? dict.noDescription}
        </p>
        <p className="mt-auto pt-2 text-sm font-semibold">
          {dict.updated}{" "}
          <time dateTime={repo.updatedAt}>
            {formatDate(repo.updatedAt, lang)}
          </time>
        </p>
      </Link>
    </li>
  );
}
