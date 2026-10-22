import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { proxy } from "@/proxy";

// A sessão do Supabase é simulada: o teste controla se há alguém logado
const session = { loggedIn: false };
vi.mock("@/lib/supabase/proxy", () => ({
  getProxySession: async () => ({
    response: NextResponse.next(),
    loggedIn: session.loggedIn,
  }),
}));

beforeEach(() => {
  session.loggedIn = false;
});

async function visit(path: string, acceptLanguage?: string) {
  const headers = new Headers();
  if (acceptLanguage) headers.set("accept-language", acceptLanguage);
  return await proxy(
    new NextRequest(`http://localhost:3000${path}`, { headers }),
  );
}

describe("proxy (idioma na primeira visita)", () => {
  it("manda quem usa o navegador em português para /pt", async () => {
    const response = await visit("/", "pt-BR,pt;q=0.9,en;q=0.8");
    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe("http://localhost:3000/pt");
  });

  it("manda quem usa o navegador em inglês para /en", async () => {
    const response = await visit("/", "en-US,en;q=0.9");
    expect(response?.headers.get("location")).toBe("http://localhost:3000/en");
  });

  it("cai no português sem cabeçalho ou com idioma que o site não tem", async () => {
    expect((await visit("/"))?.headers.get("location")).toBe(
      "http://localhost:3000/pt",
    );
    expect((await visit("/", "es-ES,fr;q=0.8"))?.headers.get("location")).toBe(
      "http://localhost:3000/pt",
    );
  });

  it("mantém o caminho ao acrescentar o idioma", async () => {
    const response = await visit("/projetos/portfolio", "en");
    expect(response?.headers.get("location")).toBe(
      "http://localhost:3000/en/projetos/portfolio",
    );
  });

  it("não mexe em endereços que já têm idioma", async () => {
    expect(await visit("/pt")).toBeUndefined();
    expect(await visit("/en/projetos", "pt-BR")).toBeUndefined();
  });

  it("não confunde um caminho que só começa com o idioma", async () => {
    // "/português" não é "/pt/..." e precisa ganhar o prefixo
    expect((await visit("/ptx", "pt"))?.headers.get("location")).toBe(
      "http://localhost:3000/pt/ptx",
    );
  });
});

describe("proxy (painel do dono)", () => {
  it("manda quem não está logado do dashboard para o login", async () => {
    const response = await visit("/pt/dashboard");
    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe(
      "http://localhost:3000/pt/login",
    );
  });

  it("protege também as subpáginas e mantém o idioma", async () => {
    expect(
      (await visit("/en/dashboard/qualquer"))?.headers.get("location"),
    ).toBe("http://localhost:3000/en/login");
  });

  it("deixa abrir o login sem estar logado", async () => {
    const response = await visit("/pt/login");
    expect(response?.headers.get("location")).toBeNull();
  });

  it("deixa quem está logado abrir o dashboard", async () => {
    session.loggedIn = true;
    const response = await visit("/pt/dashboard");
    expect(response?.headers.get("location")).toBeNull();
  });

  it("manda quem já está logado do login direto para o dashboard", async () => {
    session.loggedIn = true;
    expect((await visit("/pt/login"))?.headers.get("location")).toBe(
      "http://localhost:3000/pt/dashboard",
    );
  });

  it("não confunde rotas parecidas com o painel", async () => {
    expect(await visit("/pt/dashboards")).toBeUndefined();
  });
});
