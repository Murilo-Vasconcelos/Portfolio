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
- **Contato** com formulário validado campo a campo, que grava no banco e avisa por e-mail
- **Painel do dono** (`/pt/login` e `/pt/dashboard`): lê as mensagens, marca como respondidas e escolhe os projetos em destaque da home
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
app/[lang]/(painel)/  login e dashboard do dono, fora do layout público
components/     cabeçalho, botões e animações
components/sections/  Jornada, Experiência, Projetos, Skills, Certificações, Contato
components/dashboard/ peças do painel (login, lista de mensagens, destaques)
data/           projetos, equipe, ferramentas, skills (e logos) e dados do perfil
lib/            utilitários puros: idiomas, validação do contato, clientes do Supabase
actions/        Server Actions (formulário, login, painel): validam e chamam services/
services/       acesso a APIs externas: GitHub (com cache), Supabase e Resend
supabase/       migrações SQL do banco (tabelas e políticas de acesso)
tests/unit/     testes de unidade (Vitest)
tests/e2e/      testes de ponta a ponta (Playwright)
proxy.ts        escolhe o idioma na primeira visita e barra o painel sem login
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

## Formulário de contato

O formulário fica na seção Contato da home (`components/ContactForm.tsx`).

- **Validação por campo:** o mesmo esquema Zod (`lib/contact.ts`) roda no
  navegador, para a mensagem aparecer na hora ("E-mail inválido...",
  "mínimo de 20 caracteres"), e de novo no servidor, que nunca confia no
  navegador. Os erros são códigos; o texto de cada um está em `pt.json` e
  `en.json`.
- **Envio:** uma Server Action (`actions/contact.ts`) grava a mensagem no
  Supabase (`services/messages.ts`) e, depois de responder ao visitante,
  avisa o dono por e-mail pelo Resend (`services/email.ts`). Se o e-mail
  falhar, a mensagem continua salva e aparece no painel.
- **Estados:** botão bloqueado com spinner durante o envio (evita mensagem
  duplicada), aviso de sucesso ou de erro, e o texto não some se o envio
  falhar. Um campo escondido barra robôs simples.
- **Banco:** a tabela e as políticas de acesso estão versionadas em
  `portfolio/supabase/migrations/`. O visitante só consegue inserir; ler e
  marcar como respondida exige login.

**Por que assim:**

| Escolha | Comparado com | Critério | O que se aceitou perder |
| --- | --- | --- | --- |
| Supabase (Postgres + Auth) | Firebase, backend próprio em Node | Banco e login no mesmo serviço, SQL versionável, regras de acesso no próprio banco (RLS) e plano gratuito | Depender de um serviço externo; o plano gratuito pausa o projeto após 7 dias sem uso |
| Resend (API REST) | EmailJS, Formspree | O envio sai do servidor, sem expor chave no navegador, e a mensagem já é gravada no nosso banco | Sem domínio verificado, o remetente de teste só entrega para o e-mail da conta |
| Zod | Yup, validação manual | Um esquema só para navegador e servidor, com tipos do TypeScript gerados dele | Uma dependência a mais |
| `useActionState` + Server Action | React Hook Form, Formik | Três campos não pedem biblioteca; o React 19 já dá o estado pendente e o resultado | Recursos prontos de formulários grandes (arrays, máscaras) |

## Painel do dono (dashboard com login)

`/pt/login` leva ao `/pt/dashboard`, que só abre com sessão. O painel usa o
mesmo visual do site (fontes, cores, tema claro/escuro e PT/EN), sem a intro e
sem os efeitos de rolagem, porque é uma ferramenta de trabalho.

- **Mensagens:** as mensagens do formulário, das mais novas para as mais
  antigas, com contagem de pendentes, botão "responder" (abre o e-mail já
  endereçado) e "marcar como respondida". A marcação muda na hora
  (`useOptimistic`) e volta sozinha se o servidor recusar.
- **Projetos em destaque:** até 4 repositórios escolhidos na ordem do clique.
  A home passa a mostrá-los no lugar dos mais recentes; sem escolha, volta ao
  comportamento anterior. Salvar invalida o cache da home na hora
  (`updateTag`).
- **Login:** e-mail e senha do Supabase Auth. Senha errada mostra "E-mail ou
  senha incorretos", e o botão fica bloqueado durante a tentativa.
- **Estados:** esqueleto enquanto cada lista carrega, aviso de lista vazia e
  erro com "tentar de novo" por seção (uma seção quebrada não derruba a outra).

**Três camadas de proteção:**

1. `proxy.ts` confere a sessão antes de a página existir: sem login,
   `/dashboard` redireciona para `/login` (status 307); já logado, `/login`
   leva ao painel. Ele também renova o token do Supabase nos cookies.
2. A página e cada Server Action conferem o usuário de novo
   (`services/auth.ts`), porque uma Server Action pode ser chamada direto, sem
   passar pela página.
3. O banco só entrega e altera dados para quem está logado (políticas de RLS
   em `portfolio/supabase/migrations/`). Mesmo com um erro no código, a chave
   pública não lê mensagens.

**Como ativar:** crie um projeto no Supabase, rode as duas migrações no SQL
Editor, desligue "Allow new users to sign up" (em Authentication > Sign In /
Providers), crie o seu usuário em Authentication > Users e coloque as
variáveis de `portfolio/.env.example` na Vercel. Sem essas variáveis o site
continua funcionando: o formulário avisa que o envio falhou, o login diz que
está indisponível e a home mostra os repositórios mais recentes.

**Por que assim:**

| Escolha | Comparado com | Critério | O que se aceitou perder |
| --- | --- | --- | --- |
| Supabase Auth (e-mail e senha, cadastro desligado) | Auth.js (NextAuth), Clerk | Já é o banco do formulário: a sessão do login é a mesma que as regras de RLS conferem, sem segundo serviço | Login social e telas prontas; só existe um usuário |
| `proxy.ts` + checagem no servidor | Só o proxy, só a página | O proxy evita até renderizar o painel; a checagem repetida protege as Server Actions, como recomenda o guia de autenticação do Next | Uma consulta de sessão a mais por requisição do painel |
| Destaques no banco | Lista fixa em `data/` | Muda sem novo deploy e dá uso real ao painel | Depender do banco para a ordem da home (sem ele, volta aos mais recentes) |

## Desempenho

Lighthouse no modo celular (build de produção, 22/10/2026):

| Página | Desempenho | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Home (`/pt`) | 88 | 100 | 100 | 100 |
| Projetos (`/pt/projetos`) | 97 | 100 | 100 | 100 |
| Detalhe (`/pt/projetos/portfolio`) | 96 | 100 | 100 | 100 |
| Login (`/pt/login`) | 98 | 100 | 100 | 66* |

\* O login tem SEO baixo de propósito: está marcado como `noindex` para não
aparecer no Google.

O que mantém esses números:

- **HTML pronto com partes dinâmicas em streaming:** com `cacheComponents`, o
  esqueleto de cada página sai estático e só a parte que depende de dados
  (lista do GitHub, mensagens) chega depois, dentro de um `<Suspense>`.
- **Cache da API do GitHub** por uma hora e dos destaques por dias (com
  invalidação na hora ao salvar), então a home não espera rede.
- **Imagens pelo `next/image`:** tamanho certo para cada tela (`sizes`),
  formatos modernos e só a foto da abertura com prioridade. A foto original
  (1600x2000) saía sem otimização e segurava o LCP; otimizada, a nota da home
  subiu de 84 para 88.
- **Vídeos sob demanda:** `preload="none"` com imagem de capa; os 10 MB do
  vídeo do REVI só baixam quando alguém aperta play.
- **Painel separado por rota:** o código do dashboard (formulários, listas)
  fica no grupo `(painel)` e não entra no JavaScript da home.
- **Fontes pelo `next/font`:** baixadas no build e servidas pelo próprio site,
  sem pedir ao Google na hora e sem texto pulando (CLS 0,002 na home).

O que ainda pesa na home é o JavaScript das animações (Framer Motion e Lenis),
custo aceito na tabela de decisões.

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
  `proxy.ts` (inclusive o bloqueio do painel sem sessão), a formatação de
  datas, o `RepoCard`, o `Button`, a validação do formulário de contato (cada
  regra e cada mensagem de erro, o botão bloqueado durante o envio), o envio
  de e-mail, o login e as ações do painel (recusam sem login e validam os
  dados), e uma checagem de que `pt.json` e `en.json` têm as mesmas chaves e
  nenhum texto vazio.
- **Ponta a ponta (Playwright),** em `tests/e2e/`, no build de produção, em
  tela de computador e de celular: redirecionamento pelo idioma do navegador,
  troca de idioma mantendo a página, tema que continua depois de recarregar,
  página 404 (com status 404), a lista e o detalhe dos projetos vindos da
  API, as mensagens de erro do formulário de contato, e o painel: sem login,
  `/dashboard` redireciona para `/login` (status 307), e o login valida os
  campos e recusa senha errada. Com `E2E_OWNER_EMAIL` e `E2E_OWNER_PASSWORD`
  definidos, um teste a mais entra no painel de verdade e sai. Se a API do GitHub estiver fora, os testes de lista conferem a tela de
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
decisões de áreas específicas (GitHub, contato, painel, testes, hooks) estão
nas seções próprias.

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
