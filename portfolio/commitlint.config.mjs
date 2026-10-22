// Conventional Commits: <tipo>(escopo opcional): <descrição no imperativo>
// Ex.: "feat(projetos): Adiciona página de detalhe do projeto"
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // O histórico usa descrição em português começando com maiúscula
    // ("feat: Adiciona vídeo da Revi"), então o caso da descrição é livre.
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
  },
};

export default config;
