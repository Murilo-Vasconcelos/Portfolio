---
name: nova-funcionalidade
description: Fluxo completo para criar ou corrigir algo no portfólio, da branch ao Pull Request (branch no padrão, textos em PT/EN, testes, checagens, commits e PR com o template). Use quando pedirem uma funcionalidade, correção ou seção nova no site.
---

# Nova funcionalidade no portfólio

Siga os passos na ordem. As regras de fundo estão no `CLAUDE.md`; esta skill
é o roteiro. Comandos de npm rodam sempre dentro de `portfolio/`.

## 1. Entender e planejar

- Repita em uma frase o que vai ser feito e qual requisito do CP3 atende.
- Se o pedido tiver mais de uma leitura, pergunte antes de começar.
- Vai usar API do Next? Leia o guia em `portfolio/node_modules/next/dist/docs/`
  primeiro: o Next 16 mudou bastante (`proxy.ts`, `"use cache"`, `updateTag`).
- Precisa de dependência nova? Pare e peça autorização, dizendo qual
  alternativa foi descartada.

## 2. Criar a branch

```bash
git switch main && git pull
git switch -c feature/<assunto-em-kebab-case>   # ou fix/, docs/, refactor/...
```

O hook `pre-push` recusa branch fora do padrão e push direto na `main`.

## 3. Implementar

- Server Component por padrão; `"use client"` só com estado, efeito, evento ou
  Framer Motion.
- Dados de fora (GitHub, Supabase, e-mail) em `services/`, com cache do Next
  quando for leitura (`"use cache"` + `cacheLife` + `cacheTag`).
- Escrita de dados por Server Action em `actions/`: valide com Zod no servidor
  e, no painel, confira o login com `getAuthenticatedClient()`.
- Todo texto visível em `pt.json` **e** `en.json` (o TypeScript acusa chave
  faltando no inglês).
- Estados de carregando (`<Suspense>` com esqueleto), vazio (`EmptyState`) e
  erro (boundary com "tentar de novo").
- Botões com o componente `Button` (`pending` bloqueia e mostra o spinner).
- Imagem com `next/image`; animação respeitando `prefers-reduced-motion`.
- Tabela nova no banco: migração nova em `portfolio/supabase/migrations/`,
  sempre com RLS.
- Variável de ambiente nova: documente em `portfolio/.env.example`.

O hook de formatação do Claude Code roda o Prettier em cada arquivo editado.

## 4. Testar

- Lógica em `lib/`, `services/`, `actions/` ou componente com estado: teste
  em `portfolio/tests/unit/*.test.ts(x)` (Vitest + Testing Library).
- Fluxo novo de página (formulário, login, navegação): teste em
  `portfolio/tests/e2e/*.spec.ts` (Playwright). Componentes `async` do
  servidor só dá para testar aqui.

## 5. Conferir antes de commitar

```bash
cd portfolio
npm run lint && npm run typecheck && npm run format:check && npm test && npm run build
npm run test:e2e
```

Se algo falhar, corrija. Se não der para corrigir, conte o que falhou; nunca
esconda nem pule teste.

## 6. Revisar

Chame o subagente `revisor` (`.claude/agents/revisor.md`) para conferir o diff
contra o `CLAUDE.md`. Corrija o que ele apontar antes de seguir.

## 7. Commitar

- Confira o autor: `git config user.name` deve ser `Murilo Gomes` e
  `git config user.email`, `murilovasc.gomes@gmail.com`.
- Um commit por mudança lógica, em Conventional Commits, português,
  imperativo e maiúscula: `feat(contato): Adiciona validação do e-mail`.
- Nunca use `--no-verify`. Se o commitlint ou o lint-staged recusarem,
  corrija a mensagem ou o código.

## 8. Abrir o Pull Request

- **Peça autorização antes do push e antes de abrir o PR.**
- Use o template `.github/pull_request_template.md`: o que muda, qual
  requisito do CP3, como testar e o checklist marcado de verdade.
- Escolha de biblioteca ou serviço nova? Registre no README o porquê e a
  alternativa descartada; isso faz parte da avaliação.
- Merge só com o CI verde e a prévia da Vercel conferida, de preferência com
  _squash merge_ se houver commits de ajuste.
