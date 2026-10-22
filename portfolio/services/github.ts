import { cacheLife, cacheTag } from "next/cache";
import { profile } from "@/data/profile";

// Acesso à API REST do GitHub. Uma única chamada (a lista de repositórios)
// alimenta a home, a página de projetos e cada página de detalhe, e o
// resultado fica em cache por uma hora. Assim o site faz no máximo uma
// requisição por hora, longe do limite de 60/h da API sem token.

const API_URL = "https://api.github.com";

// O usuário vem do link do GitHub no perfil, para não repetir o dado
export const githubUser = profile.links.github.split("/").pop() ?? "";

export type Repo = {
  slug: string;
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  url: string;
  homepage: string | null;
  updatedAt: string;
};

// Só os campos que o site usa da resposta da API
type ApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

export class GitHubApiError extends Error {
  constructor(
    message: string,
    readonly rateLimited = false,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

function toRepo(repo: ApiRepo): Repo {
  return {
    slug: repo.name.toLowerCase(),
    name: repo.name,
    description: repo.description,
    language: repo.language,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count,
    url: repo.html_url,
    homepage: repo.homepage || null,
    // pushed_at muda só com código novo; updated_at muda até com uma estrela
    updatedAt: repo.pushed_at,
  };
}

type ListResult =
  | { ok: true; repos: Repo[] }
  | { ok: false; status: number; rateLimited: boolean };

// Lista os repositórios públicos, do mais recente para o mais antigo.
// A falha volta como valor (e não como exceção) para poder ganhar um cache
// curtinho: "seconds" tira o resultado do HTML estático, então uma falha no
// build não quebra o build nem fica congelada no site. A página mostra o
// esqueleto e tenta de novo na hora do acesso.
export async function listRepos(): Promise<ListResult> {
  "use cache";
  cacheTag("github-repos");

  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(
    `${API_URL}/users/${githubUser}/repos?type=owner&sort=pushed&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  ).catch(() => null);

  if (!response?.ok) {
    cacheLife("seconds");
    const status = response?.status ?? 0;
    // Sem token, o GitHub responde 403 (ou 429) quando o limite acaba
    const rateLimited =
      status === 429 ||
      (status === 403 &&
        response?.headers.get("x-ratelimit-remaining") === "0");
    return { ok: false, status, rateLimited };
  }

  cacheLife("hours");
  const repos: ApiRepo[] = await response.json();
  return {
    ok: true,
    repos: repos
      // Fora: forks, arquivados e o repositório do README do perfil
      .filter((repo) => !repo.fork && !repo.archived)
      .filter((repo) => repo.name.toLowerCase() !== githubUser.toLowerCase())
      .map(toRepo),
  };
}

// Versão para as páginas: uma falha vira exceção e sobe para a fronteira de
// erro (ApiErrorBoundary), que mostra a tela de erro com "tentar de novo".
export async function getRepos(): Promise<Repo[]> {
  const result = await listRepos();
  if (!result.ok) {
    throw new GitHubApiError(
      result.rateLimited
        ? "Limite de requisições da API do GitHub atingido"
        : `A API do GitHub respondeu ${result.status}`,
      result.rateLimited,
    );
  }
  return result.repos;
}

export async function getRepo(slug: string): Promise<Repo | null> {
  const repos = await getRepos();
  return repos.find((repo) => repo.slug === slug.toLowerCase()) ?? null;
}
