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
npm run build         # build de produção
```

Antes de dizer que uma tarefa terminou, rode `lint`, `typecheck` e `build` e
confira que passam. Se algo falhar, conte o que falhou; não esconda.

## Arquitetura e pastas (dentro de `portfolio/`)

```
app/[lang]/            rotas por idioma (pt | en), layout e dicionários
app/[lang]/dictionaries/pt.json, en.json   todo texto visível do site
components/            componentes reutilizáveis (botões, animações, cabeçalho)
components/sections/   uma seção da página por arquivo
data/                  dados que não mudam de idioma (links, imagens, skills)
lib/                   utilitários puros e configuração (i18n, site, hooks simples)
services/              acesso a APIs externas (GitHub, Supabase, e-mail) — criar quando precisar
hooks/                 hooks React reutilizáveis — criar quando precisar
proxy.ts               escolhe o idioma na primeira visita (antigo middleware)
public/                imagens, vídeos e currículo
```

Regras:

- **Next.js 16 é diferente do que você conhece.** Antes de usar uma API do
  Next, leia o guia em `portfolio/node_modules/next/dist/docs/`.
- Server Components por padrão. Só use `"use client"` quando o componente
  precisa de estado, efeitos, eventos do navegador ou Framer Motion.
- Chamadas a APIs externas ficam em `services/`, nunca direto no componente.
  Use o cache do Next (`"use cache"`, `cacheLife`) para não repetir requisições.
- Nenhum texto visível fica no JSX: tudo vai para `pt.json` **e** `en.json`. O
  tipo `Dictionary` vem do `pt.json`, então o TypeScript acusa chave faltando.
- Imagens com `next/image`; mídia pesada carregada sob demanda.
- Respeite `prefers-reduced-motion` (veja `globals.css`) em toda animação nova.
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
  `.github/pull_request_template.md`. Merge só com lint, typecheck e build
  passando e com a prévia da Vercel conferida.
- Prefira *squash merge* quando a branch tiver commits de ajuste.

## Como o agente deve trabalhar

- Pergunte antes de: push, abrir ou fazer merge de PR, instalar dependência
  nova, apagar arquivos ou mudar configuração de deploy.
- Mudanças pequenas e focadas no que foi pedido; não refatore o que não foi
  pedido.
- Ao criar uma decisão de stack (biblioteca, serviço), registre no README o
  porquê e a alternativa descartada; isso faz parte da avaliação.
