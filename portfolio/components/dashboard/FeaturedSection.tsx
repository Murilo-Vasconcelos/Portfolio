import type { Dictionary } from "@/app/[lang]/dictionaries";
import FeaturedPicker from "@/components/dashboard/FeaturedPicker";
import EmptyState from "@/components/EmptyState";
import { FEATURED_MAX, getFeaturedSlugs } from "@/services/featured";
import { getRepos } from "@/services/github";

// Busca os repositórios (do cache da API do GitHub) e a escolha atual
export default async function FeaturedSection({
  dict,
}: {
  dict: Dictionary["panel"]["dashboard"]["featured"];
}) {
  const [repos, featured] = await Promise.all([getRepos(), getFeaturedSlugs()]);

  if (repos.length === 0) {
    return <EmptyState title={dict.empty.title} text={dict.empty.text} />;
  }

  // Só o que o formulário precisa vai para o navegador
  const options = repos.map(({ slug, name, language }) => ({
    slug,
    name,
    language,
  }));
  const known = new Set(options.map((repo) => repo.slug));

  return (
    <FeaturedPicker
      repos={options}
      initial={featured.filter((slug) => known.has(slug))}
      max={FEATURED_MAX}
      dict={dict}
    />
  );
}
