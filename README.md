# Portfólio — Murilo Gomes

Estudante de Engenharia de Software. Site de uma página que conta a trajetória
profissional e acadêmica por rolagem, com tema claro/escuro, PT/EN e animações.

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
- **Skills:** 15 tecnologias com logo, em 4 grupos (linguagens, front-end, dados e nuvem, design)
- **Certificações:** 9 certificados em 4 grupos e faixas infinitas de palavras
- **Marcos** e **Contato** (botões magnéticos)
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
components/     cabeçalho, botões e animações
components/sections/  Jornada, Experiência, Projetos, Skills, Certificações, Marcos, Contato
data/           projetos, equipe, ferramentas, skills (e logos) e dados do perfil
lib/i18n.ts     lista de idiomas
proxy.ts        escolhe o idioma na primeira visita
public/         currículo em PDF e imagens
```

## Padrões e fluxo de trabalho

As regras completas (para pessoas e para a IA) estão no [`CLAUDE.md`](CLAUDE.md).

- **Formatação:** Prettier (com ordenação das classes do Tailwind) e ESLint.
  `npm run format` formata tudo; `npm run lint` e `npm run typecheck` conferem.
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
