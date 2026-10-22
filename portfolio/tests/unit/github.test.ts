import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getRepo,
  getRepos,
  GitHubApiError,
  githubUser,
  listRepos,
} from "@/services/github";

// O cache do Next só existe dentro do servidor do Next; no teste vira no-op
vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

function apiRepo(overrides: Record<string, unknown> = {}) {
  return {
    name: "Portfolio",
    description: "Meu portfólio",
    language: "TypeScript",
    topics: ["nextjs"],
    stargazers_count: 3,
    html_url: "https://github.com/Murilo-Vasconcelos/Portfolio",
    homepage: "",
    pushed_at: "2026-10-20T12:00:00Z",
    fork: false,
    archived: false,
    ...overrides,
  };
}

function mockFetch(response: Response | Error) {
  const fetchMock = vi.fn(() =>
    response instanceof Error
      ? Promise.reject(response)
      : Promise.resolve(response),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), init);

beforeEach(() => {
  vi.stubEnv("GITHUB_TOKEN", "");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("listRepos", () => {
  it("converte a resposta da API para o formato do site", async () => {
    mockFetch(json([apiRepo()]));

    const result = await listRepos();

    expect(result).toEqual({
      ok: true,
      repos: [
        {
          slug: "portfolio",
          name: "Portfolio",
          description: "Meu portfólio",
          language: "TypeScript",
          topics: ["nextjs"],
          stars: 3,
          url: "https://github.com/Murilo-Vasconcelos/Portfolio",
          // homepage vazia vira null para o botão "Abrir o site" sumir
          homepage: null,
          updatedAt: "2026-10-20T12:00:00Z",
        },
      ],
    });
  });

  it("deixa de fora forks, arquivados e o repositório do perfil", async () => {
    mockFetch(
      json([
        apiRepo({ name: "Fork", fork: true }),
        apiRepo({ name: "Antigo", archived: true }),
        apiRepo({ name: githubUser.toLowerCase() }),
        apiRepo({ name: "Fica" }),
      ]),
    );

    const result = await listRepos();

    expect(result.ok && result.repos.map((repo) => repo.name)).toEqual([
      "Fica",
    ]);
  });

  it("aceita repositório sem tópicos", async () => {
    mockFetch(json([apiRepo({ topics: undefined })]));
    const result = await listRepos();
    expect(result.ok && result.repos[0].topics).toEqual([]);
  });

  it("manda o token só quando ele existe", async () => {
    const withoutToken = mockFetch(json([]));
    await listRepos();
    expect(withoutToken.mock.calls[0]).toEqual([
      expect.stringContaining(`/users/${githubUser}/repos`),
      {
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      },
    ]);

    vi.stubEnv("GITHUB_TOKEN", "abc123");
    const withToken = mockFetch(json([]));
    await listRepos();
    expect(withToken.mock.calls[0]).toEqual([
      expect.any(String),
      {
        headers: expect.objectContaining({ Authorization: "Bearer abc123" }),
      },
    ]);
  });

  it("reconhece o limite de requisições (403 com remaining 0)", async () => {
    mockFetch(
      json(
        { message: "API rate limit exceeded" },
        { status: 403, headers: { "x-ratelimit-remaining": "0" } },
      ),
    );
    expect(await listRepos()).toEqual({
      ok: false,
      status: 403,
      rateLimited: true,
    });
  });

  it("reconhece o limite de requisições (429)", async () => {
    mockFetch(json({}, { status: 429 }));
    expect(await listRepos()).toMatchObject({ rateLimited: true });
  });

  it("um 403 comum não é limite de requisições", async () => {
    mockFetch(
      json({}, { status: 403, headers: { "x-ratelimit-remaining": "42" } }),
    );
    expect(await listRepos()).toEqual({
      ok: false,
      status: 403,
      rateLimited: false,
    });
  });

  it("devolve status 0 quando a rede cai, sem lançar exceção", async () => {
    mockFetch(new TypeError("fetch failed"));
    expect(await listRepos()).toEqual({
      ok: false,
      status: 0,
      rateLimited: false,
    });
  });
});

describe("getRepos e getRepo", () => {
  it("transformam a falha da API em GitHubApiError", async () => {
    mockFetch(json({}, { status: 500 }));

    const error = await getRepos().catch((err: unknown) => err);

    expect(error).toBeInstanceOf(GitHubApiError);
    expect(error).toMatchObject({
      message: "A API do GitHub respondeu 500",
      rateLimited: false,
    });
  });

  it("marcam o erro quando é limite de requisições", async () => {
    mockFetch(json({}, { status: 429 }));
    await expect(getRepos()).rejects.toMatchObject({ rateLimited: true });
  });

  it("acham o repositório pelo slug, sem diferenciar maiúsculas", async () => {
    mockFetch(json([apiRepo({ name: "GS-Edge-Computing" })]));
    expect((await getRepo("GS-EDGE-computing"))?.name).toBe(
      "GS-Edge-Computing",
    );
  });

  it("devolvem null para um repositório que não existe", async () => {
    mockFetch(json([apiRepo()]));
    expect(await getRepo("nao-existe")).toBeNull();
  });
});
