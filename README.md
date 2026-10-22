# Portfólio — Murilo Gomes

Estudante de Engenharia de Software. Portfólio que conta a trajetória
profissional e acadêmica por rolagem, com tema claro/escuro, PT/EN e animações,
projetos carregados da API do GitHub, formulário de contato e um painel do dono.

**Site publicado:** https://portfolio-taupe-nu-izjvzchmfp.vercel.app
(a Vercel publica de novo a cada push na `main`).

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lenis · next-themes

## Como rodar

Precisa do Node.js (versão LTS).

```bash
cd portfolio
npm install   # também instala os hooks do Git (Husky)
npm run dev
```

Abra http://localhost:3000. O endereço `/` leva para `/pt` ou `/en`, conforme o
idioma do navegador de quem visita.

## O que o site tem

- Cores (preto, cinza e branco), fontes (Nunito e Oswald), tema claro/escuro e PT/EN
- Rolagem suave (Lenis), barra de progresso, cursor personalizado e intro com contador
- Abertura com nome gigante, foto com efeito do mouse e números que contam
- **Jornada:** frase que acende palavra por palavra e linha do tempo que se desenha na rolagem
- **Experiência:** Bozza, com a TV do RH em destaque
- **Projetos:** REVI em destaque (com a equipe e links do LinkedIn), Global Solution, GoGames e TCC, em cards que inclinam com o mouse
- **Skills:** 9 tecnologias com logo, em 3 grupos (linguagens, front-end e dados)
- **Certificações:** 9 certificados em 4 grupos e faixas infinitas de palavras
- **Contato** com botões magnéticos
- Troca de tema com um círculo que se espalha a partir do botão (navegadores com View Transitions)
- Quem usa "reduzir movimento" no sistema vê tudo parado e no lugar
- Prévia de link (imagem ao compartilhar no LinkedIn/WhatsApp), sitemap, robots e hreflang PT/EN
- Link "pular para o conteúdo" e foco visível para quem navega pelo teclado

## O que você precisa preencher

Dados que não mudam de idioma ficam em `data/`:

- `data/profile.ts`: foto (`photo`), e-mail (`links.email`), LinkedIn, GitHub e os números da abertura
- `data/projects.ts`: link do repositório de cada projeto e a equipe do REVI. Quando o resultado do NEXT sair e você puder divulgar o código do REVI, coloque o link em `repo` e o botão "Ver código" aparece
- `data/experience.ts`: ferramentas mostradas na Bozza
- `data/skills.ts` e `data/skillIcons.ts`: tecnologias da seção Skills e seus logos. Para acrescentar uma, coloque o logo em `skillIcons.ts` e inclua no grupo certo em `skills.ts`
- Currículo: salve o PDF em `public/curriculo-murilo.pdf`. Para atualizar, é só trocar o arquivo

## Como funcionam os idiomas

Todo texto do site fica em dois arquivos:

```
app/[lang]/dictionaries/pt.json
app/[lang]/dictionaries/en.json
```

Para mudar ou acrescentar um texto, edite os dois. Se faltar uma chave no
inglês, o TypeScript avisa. O arquivo `proxy.ts` escolhe o idioma na primeira
visita, e o botão PT | EN no topo troca depois.

## Estrutura

```
app/[lang]/     página, layout e dicionários de texto
app/[lang]/projetos/  lista de projetos e página de cada um (/projetos/[slug])
components/     cabeçalho, botões e animações
components/sections/  Jornada, Experiência, Projetos, Skills, Certificações, Contato
data/           projetos, equipe, ferramentas, skills (e logos) e dados do perfil
lib/i18n.ts     lista de idiomas
services/       acesso à API do GitHub, com cache
tests/unit/     testes de unidade (Vitest)
tests/e2e/      testes de ponta a ponta (Playwright)
proxy.ts        escolhe o idioma na primeira visita
public/         currículo em PDF e imagens
```

## Projetos pela API do GitHub

A home mostra os repositórios públicos mais recentes, `/pt/projetos` lista
todos e cada um tem a sua página em `/pt/projetos/<nome-do-repositório>`.
Projetos cadastrados em `data/projects.ts` ganham também a imagem e os textos
dos dicionários na página de detalhe.

- **Onde fica:** `services/github.ts`. Uma única chamada
  (`GET /users/<usuário>/repos`) alimenta todas as páginas e fica em cache por
  uma hora (`"use cache"` + `cacheLife("hours")`), então o site faz no máximo
  uma requisição por hora.
- **Limite de requisições:** sem token a API aceita 60 por hora por IP; com o
  `GITHUB_TOKEN` (veja `portfolio/.env.example`), 5.000. Com o cache, o site
  funciona bem até sem token.
- **Estados:** esqueleto enquanto a lista carrega, aviso de lista vazia, tela
  de erro com "tentar de novo" quando a API falha e página 404 para endereço
  ou projeto que não existe.
- **Se a API falhar no build:** a falha fica em cache por poucos segundos, o
  que tira esse trecho do HTML estático. O build passa, a página sai com o
  esqueleto e tenta de novo quando alguém acessa.

**Por que assim:** buscar no servidor com o cache do Next deixa os projetos no
HTML (bom para SEO e para o Lighthouse) e evita repetir chamadas. A
alternativa de buscar no navegador (SWR ou TanStack Query) gastaria o limite
da API a cada visita e mostraria o esqueleto sempre. A API GraphQL do GitHub
foi descartada porque exige token até para dados públicos, e a REST entrega
tudo que o site usa (descrição, linguagem, tópicos e data de atualização) sem
biblioteca extra.

## Testes e CI

```bash
cd portfolio
npm test            # Vitest: testes de unidade (uma passada)
npm run test:watch  # Vitest em modo observação, enquanto programa
npm run test:e2e    # Playwright: faz o build, sobe o site e testa no Chromium
```

- **Unidade (Vitest + Testing Library),** em `tests/unit/`: o serviço do
  GitHub com a API simulada (conversão dos dados, filtro de forks e
  arquivados, limite de requisições, queda de rede), a escolha de idioma do
  `proxy.ts`, a formatação de datas, o `RepoCard` e uma checagem de que
  `pt.json` e `en.json` têm as mesmas chaves e nenhum texto vazio.
- **Ponta a ponta (Playwright),** em `tests/e2e/`, no build de produção, em
  tela de computador e de celular: redirecionamento pelo idioma do navegador,
  troca de idioma mantendo a página, tema que continua depois de recarregar,
  página 404 (com status 404) e a lista e o detalhe dos projetos vindos da
  API. Se a API do GitHub estiver fora, os testes de lista conferem a tela de
  erro com "tentar de novo", e os de detalhe são pulados com o motivo.
- **CI (GitHub Actions),** em `.github/workflows/ci.yml`, a cada Pull Request
  e push na `main`, em dois jobs paralelos: (1) lint, typecheck,
  `format:check` e Vitest; (2) build e Playwright, usando o token automático
  do Actions para não esbarrar no limite da API do GitHub. O relatório do
  Playwright fica salvo como artefato da execução.

**Por que assim:** o Vitest é o que o guia do Next recomenda para testes de
unidade, usa a mesma configuração do Vite, entende TypeScript e JSX sem Babel
e é bem mais rápido que o Jest, que foi a alternativa descartada (precisa de
transformador à parte e tem suporte a ESM mais trabalhoso). Componentes
`async` do servidor não rodam no Vitest, por isso páginas inteiras são
testadas no Playwright. O Playwright foi escolhido no lugar do Cypress porque
roda em paralelo de graça, testa Chromium, Firefox e WebKit, emula celular e
sobe o servidor do Next sozinho (`webServer`). O CI fica no GitHub Actions
porque o código já está no GitHub e o plano gratuito cobre repositórios
públicos; a Vercel continua cuidando só do deploy.

## Decisões de stack

Cada escolha com o que foi comparado, o critério e o que se aceitou perder. As
decisões de áreas específicas (GitHub, testes, hooks) estão nas seções abaixo.

| Escolha | Comparado com | Critério | O que se aceitou perder |
| --- | --- | --- | --- |
| Next.js 16 (App Router) | Vite + React Router, TanStack Router | Rotas, renderização no servidor, cache e otimização de imagem já incluídos; HTML pronto ajuda SEO e Lighthouse | Mais conceitos (Server Components, cache) e o melhor resultado depende da Vercel |
| Tailwind CSS 4 | CSS Modules, shadcn/ui, MUI | Identidade própria sem brigar com o tema de uma biblioteca; o Prettier ordena as classes | Componentes prontos; o JSX fica com classes longas |
| Framer Motion + Lenis | GSAP, só CSS | Animações ligadas à rolagem com API em React e respeito a "reduzir movimento" | Peso no pacote, que aparece no tempo de bloqueio da home |
| next-themes | Context + `localStorage` feito à mão | Grava o tema e aplica antes da pintura, sem piscar | Uma dependência a mais para algo pequeno |
| Conventional Commits + commitlint | Gitmoji, mensagens livres | Padrão de mercado, lido por ferramentas de changelog e fácil de validar | Emojis e mensagens livres |
| Vercel | Netlify, Hostinger | Feita pela equipe do Next, prévia por PR e deploy a cada push sem configuração | Prender o deploy a um fornecedor |

## Padrões e fluxo de trabalho

As regras completas (para pessoas e para a IA) estão no [`CLAUDE.md`](CLAUDE.md).

- **Formatação:** Prettier (com ordenação das classes do Tailwind) e ESLint.
  `npm run format` formata tudo; `npm run lint` e `npm run typecheck` conferem.
  O CI roda tudo isso de novo em cada Pull Request (veja "Testes e CI").
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
  em português, ex.: `feat(projetos): Adiciona página de detalhe`. Tipos:
  `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
  `chore`, `revert`.
- **Branches:** nada vai direto para a `main`. Cada mudança nasce em
  `feature/<assunto>` (ou `fix/`, `docs/`, `chore/`...) e entra por Pull
  Request, com o template de `.github/pull_request_template.md`.
- **Hooks do Git (Husky):**
  - `pre-commit`: lint-staged roda ESLint e Prettier só nos arquivos alterados
  - `commit-msg`: commitlint rejeita mensagens fora do padrão
  - `pre-push`: bloqueia push direto na `main` e nomes de branch fora do padrão

**Por que essas ferramentas:** Husky + lint-staged é o par mais usado no
ecossistema Node e roda só nos arquivos do commit, então é rápido. A
alternativa Lefthook é mais rápida em monorepos grandes, mas exige um binário
à parte e não traz ganho num projeto deste tamanho. O Prettier foi escolhido no
lugar do Biome porque o ESLint do Next continua necessário (regras de React e
Core Web Vitals), e o Prettier tem o plugin oficial do Tailwind.

## Harness de IA

- `CLAUDE.md`: arquitetura, convenções, commits, branches e limites do agente
- `portfolio/AGENTS.md`: aviso do Next.js 16 para ler a documentação local
- `.claude/settings.json`: libera comandos seguros (lint, build, git local),
  pede confirmação para `git push` e instalar pacotes, e proíbe ler `.env`,
  forçar push ou pular os hooks
