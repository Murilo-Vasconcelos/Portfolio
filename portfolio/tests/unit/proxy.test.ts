import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

function visit(path: string, acceptLanguage?: string) {
  const headers = new Headers();
  if (acceptLanguage) headers.set("accept-language", acceptLanguage);
  return proxy(new NextRequest(`http://localhost:3000${path}`, { headers }));
}

describe("proxy (idioma na primeira visita)", () => {
  it("manda quem usa o navegador em português para /pt", () => {
    const response = visit("/", "pt-BR,pt;q=0.9,en;q=0.8");
    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toBe("http://localhost:3000/pt");
  });

  it("manda quem usa o navegador em inglês para /en", () => {
    const response = visit("/", "en-US,en;q=0.9");
    expect(response?.headers.get("location")).toBe("http://localhost:3000/en");
  });

  it("cai no português sem cabeçalho ou com idioma que o site não tem", () => {
    expect(visit("/")?.headers.get("location")).toBe(
      "http://localhost:3000/pt",
    );
    expect(visit("/", "es-ES,fr;q=0.8")?.headers.get("location")).toBe(
      "http://localhost:3000/pt",
    );
  });

  it("mantém o caminho ao acrescentar o idioma", () => {
    const response = visit("/projetos/portfolio", "en");
    expect(response?.headers.get("location")).toBe(
      "http://localhost:3000/en/projetos/portfolio",
    );
  });

  it("não mexe em endereços que já têm idioma", () => {
    expect(visit("/pt")).toBeUndefined();
    expect(visit("/en/projetos", "pt-BR")).toBeUndefined();
  });

  it("não confunde um caminho que só começa com o idioma", () => {
    // "/português" não é "/pt/..." e precisa ganhar o prefixo
    expect(visit("/ptx", "pt")?.headers.get("location")).toBe(
      "http://localhost:3000/pt/ptx",
    );
  });
});
