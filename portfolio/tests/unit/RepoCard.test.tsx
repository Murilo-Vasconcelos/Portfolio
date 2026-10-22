import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import pt from "@/app/[lang]/dictionaries/pt.json";
import RepoCard from "@/components/RepoCard";
import type { Repo } from "@/services/github";

const repo: Repo = {
  slug: "portfolio",
  name: "Portfolio",
  description: "Meu portfólio em Next.js",
  language: "TypeScript",
  topics: [],
  stars: 4,
  url: "https://github.com/Murilo-Vasconcelos/Portfolio",
  homepage: null,
  updatedAt: "2026-10-20T12:00:00Z",
};

function renderCard(overrides: Partial<Repo> = {}) {
  return render(
    <ul>
      <RepoCard
        repo={{ ...repo, ...overrides }}
        lang="pt"
        dict={pt.projectsPage}
      />
    </ul>,
  );
}

describe("RepoCard", () => {
  it("leva para a página do projeto no idioma atual", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/pt/projetos/portfolio",
    );
  });

  it("mostra nome, descrição, linguagem, estrelas e data", () => {
    renderCard();
    expect(
      screen.getByRole("heading", { name: "Portfolio" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Meu portfólio em Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText(/4/)).toHaveTextContent("4 Estrelas");
    expect(screen.getByText("20 de out. de 2026")).toHaveAttribute(
      "datetime",
      "2026-10-20T12:00:00Z",
    );
  });

  it("usa o texto padrão quando o repositório não tem descrição", () => {
    renderCard({ description: null });
    expect(screen.getByText(pt.projectsPage.noDescription)).toBeInTheDocument();
  });

  it("esconde as estrelas quando não há nenhuma", () => {
    renderCard({ stars: 0 });
    expect(screen.queryByText(/Estrelas/)).not.toBeInTheDocument();
  });
});
