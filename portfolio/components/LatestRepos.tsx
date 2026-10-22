import type { Dictionary } from "@/app/[lang]/dictionaries";
import EmptyState from "@/components/EmptyState";
import RepoCard from "@/components/RepoCard";
import { profile } from "@/data/profile";
import type { Locale } from "@/lib/i18n";
import { getRepos } from "@/services/github";

// Os repositórios atualizados mais recentemente, para a seção Projetos da home
export default async function LatestRepos({
  lang,
  dict,
  limit = 4,
}: {
  lang: Locale;
  dict: Dictionary["projectsPage"];
  limit?: number;
}) {
  const repos = (await getRepos()).slice(0, limit);

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
