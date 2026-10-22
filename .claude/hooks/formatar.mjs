#!/usr/bin/env node
// Hook PostToolUse do Claude Code: depois que o agente edita ou cria um
// arquivo do app, roda o Prettier nele. Assim o código já sai no padrão do
// projeto, sem depender de o agente lembrar de rodar `npm run format`.
// Roda depois da edição, então não desfaz nada: sai com 0 quando dá certo ou
// não se aplica, e com 2 quando o Prettier falha (o Claude Code mostra o aviso
// ao agente, que corrige o arquivo).
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const EXTENSOES = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".css",
  ".md",
]);

let entrada;
try {
  entrada = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const arquivo = entrada?.tool_input?.file_path;
const raiz = process.env.CLAUDE_PROJECT_DIR ?? entrada?.cwd ?? process.cwd();
const app = path.join(raiz, "portfolio");
const prettier = path.join(app, "node_modules", ".bin", "prettier");

// Só arquivos dentro de portfolio/ (onde está a configuração do Prettier)
if (
  typeof arquivo !== "string" ||
  !path.resolve(arquivo).startsWith(app + path.sep) ||
  !EXTENSOES.has(path.extname(arquivo)) ||
  !existsSync(arquivo) ||
  !existsSync(prettier)
) {
  process.exit(0);
}

try {
  // --ignore-unknown e o .prettierignore decidem o que fica de fora
  execFileSync(prettier, ["--write", "--ignore-unknown", arquivo], {
    cwd: app,
    stdio: ["ignore", "ignore", "pipe"],
  });
} catch (erro) {
  // Erro de sintaxe, por exemplo
  process.stderr.write(
    `Prettier não conseguiu formatar ${arquivo}: ${erro.stderr ?? erro.message}\n`,
  );
  process.exit(2);
}
process.exit(0);
