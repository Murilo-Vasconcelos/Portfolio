# CLAUDE.md

Regras do projeto para o Claude Code (e qualquer agente de IA) neste repositório.
Leia tudo antes de mudar código. Em caso de dúvida, pergunte em vez de supor.

@portfolio/AGENTS.md

## O projeto

Portfólio pessoal do Murilo Gomes (CP3 de Web Development, FIAP). O app Next.js
fica em `portfolio/`; a raiz do repositório guarda só documentação e o harness
de IA. **Rode todos os comandos de npm dentro de `portfolio/`.**

Stack: Next.js 16 (App Router, `cacheComponents`), React 19, TypeScript strict,
Tailwind CSS 4, Framer Motion, Lenis e next-themes. Deploy na Vercel a partir
da `main`.

## Comandos

```bash
cd portfolio
npm run dev           # servidor local em http://localhost:3000
npm run lint          # ESLint (regras do Next + TypeScript)
npm run typecheck     # tsc --noEmit
npm run format        # Prettier em tudo (format:check só confere)
npm test              # Vitest: testes de unidade em tests/unit/
npm run test:e2e      # Playwright: build + testes de ponta a ponta em tests/e2e/
npm run build         # build de produção
```

Antes de dizer que uma tarefa terminou, rode `lint`, `typecheck`, `test` e
`build` e confira que passam (o CI do GitHub Actions roda os mesmos passos e
mais o `test:e2e` em cada PR). Se algo falhar, conte o que falhou; não esconda.

## Arquitetura e pastas (dentro de `portfolio/`)

```
app/[lang]/            rotas por idioma (pt | en), layout e dicionários
app/[lang]/dictionaries/pt.json, en.json   todo texto visível do site
app/[lang]/(painel)/   login e dashboard do dono (rotas protegidas)
components/            componentes reutilizáveis (botões, animações, cabeçalho)
components/sections/   uma seção da página por arquivo
components/dashboard/  peças do painel (login, mensagens, destaques)
data/                  dados que não mudam de idioma (links, imagens, skills)
lib/                   utilitários puros e configuração (i18n, site, hooks simples)
actions/               Server Actions ("use server"): validam a entrada e chamam services/
services/              acesso a APIs externas (GitHub, Supabase, Resend)
supabase/migrations/   SQL do banco, com as políticas de RLS (toda mudança de tabela vira migração nova)
tests/unit/            testes de unidade (Vitest + Testing Library), *.test.ts(x)
tests/e2e/             testes de ponta a ponta (Playwright), *.spec.ts
hooks/                 hooks React reutilizáveis — criar quando precisar
proxy.ts               escolhe o idioma e barra o painel sem login (antigo middleware)
public/                imagens, vídeos e currículo
```

Regras:

- **Next.js 16 é diferente do que você conhece.** Antes de usar uma API do
  Next, leia o guia em `portfolio/node_modules/next/dist/docs/`.
- Server Components por padrão. Só use `"use client"` quando o componente
  precisa de estado, efeitos, eventos do navegador ou Framer Motion.
- Chamadas a APIs externas ficam em `services/`, nunca direto no componente.
  Mutações entram por Server Actions em `actions/`, que validam de novo no
  servidor (Zod) e conferem o login antes de mexer em dados do painel.
  Página ou ação nova do painel chama `getCurrentUser`/`getAuthenticatedClient`
  (`services/auth.ts`); o `proxy.ts` sozinho não basta, porque uma Server
  Action pode ser chamada sem passar pela página.
  Use o cache do Next (`"use cache"`, `cacheLife`) para não repetir requisições.
- Nenhum texto visível fica no JSX: tudo vai para `pt.json` **e** `en.json`. O
  tipo `Dictionary` vem do `pt.json`, então o TypeScript acusa chave faltando.
- Imagens com `next/image`; mídia pesada carregada sob demanda.
- Respeite `prefers-reduced-motion` (veja `globals.css`) em toda animação nova.
- Código novo em `lib/`, `services/` ou componente com lógica ganha teste em
  `tests/unit/`; fluxo novo de página (formulário, login) ganha teste em
  `tests/e2e/`. Componentes `async` do servidor só dá para testar no Playwright.
- Segredos só em variáveis de ambiente. Nunca leia nem commite `.env*`;
  documente toda variável nova em `portfolio/.env.example`.

## Convenções de código

- TypeScript strict, sem `any`. Tipos de props declarados junto do componente.
- Componentes em PascalCase (`TiltCard.tsx`) com `export default function`.
  Hooks em camelCase começando com `use` (`useMediaQuery.ts`). Utilitários e
  dados em camelCase (`site.ts`, `skillIcons.ts`).
- Imports pelo alias `@/` (ex.: `@/components/Header`).
- Estilo com classes do Tailwind; o Prettier ordena as classes sozinho.
- Comentários em português, curtos, explicando o *porquê*.
- Formatação é do Prettier (`.prettierrc.json`); não discuta estilo, rode
  `npm run format`.

## Commits (Conventional Commits)

Formato: `<tipo>(escopo opcional): <descrição>`, em português, no imperativo,
começando com maiúscula. Exemplos:

```
feat(projetos): Adiciona página de detalhe do projeto
fix: Corrige foto de perfil cortada no mobile
docs: Explica o fluxo de branches no README
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`,
`ci`, `chore`, `revert`. Um commit por mudança lógica; commits pequenos.

O autor de todo commit é sempre `Murilo Gomes <murilovasc.gomes@gmail.com>`,
inclusive quando quem commita é a IA. Antes do primeiro commit em um ambiente
novo, confira `git config user.name` e `git config user.email`.

O commitlint (hook `commit-msg`) rejeita mensagens fora do padrão. O hook
`pre-commit` roda ESLint e Prettier nos arquivos alterados (lint-staged).
**Nunca use `--no-verify`** para pular os hooks; corrija o problema.

## Branches e Pull Requests

- A `main` é sempre publicável (a Vercel publica cada push nela). Ninguém faz
  push direto nela; o hook `pre-push` bloqueia.
- Todo trabalho começa em uma branch a partir da `main` atualizada:
  `feature/<assunto>` para funcionalidade, `fix/<assunto>` para correção e
  `docs/`, `chore/`, `refactor/`, `test/`, `ci/` para o resto. Assunto em
  kebab-case: `feature/github-api`, `fix/foto-hero`. (`claude/*` é reservado
  para sessões do Claude Code na nuvem.)
- Termine com um Pull Request para a `main` usando o template de
  `.github/pull_request_template.md`. Merge só com o CI verde (lint, typecheck,
  testes e build) e com a prévia da Vercel conferida.
- Prefira *squash merge* quando a branch tiver commits de ajuste.

## Como o agente deve trabalhar

- Pergunte antes de: push, abrir ou fazer merge de PR, instalar dependência
  nova, apagar arquivos ou mudar configuração de deploy.
- Mudanças pequenas e focadas no que foi pedido; não refatore o que não foi
  pedido.
- Ao criar uma decisão de stack (biblioteca, serviço), registre no README o
  porquê e a alternativa descartada; isso faz parte da avaliação.

## Ferramentas do agente (versionadas no repositório)

- **Skill `nova-funcionalidade`** (`.claude/skills/`): o roteiro da branch ao
  PR. Use em todo pedido de funcionalidade ou correção.
- **Subagente `revisor`** (`.claude/agents/revisor.md`): confere o diff contra
  este arquivo. Chame antes de abrir o PR e corrija o que ele apontar.
- **Hook de formatação** (`.claude/hooks/formatar.mjs`): roda o Prettier em
  cada arquivo de `portfolio/` que o agente edita. Se ele avisar erro de
  sintaxe, corrija o arquivo.
- **MCPs** (`.mcp.json`):
  - `next-devtools`: erros, rotas e logs do `npm run dev` em execução. Prefira
    ele a rodar `next build` só para ver se compila.
  - `playwright`: abre o site num navegador para conferir a tela de verdade.
  - `supabase`: só leitura (`read_only=true`). Serve para consultar tabelas e
    políticas; mudança no banco continua sendo migração nova, nunca SQL solto.
