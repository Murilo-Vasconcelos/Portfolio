# Portfólio — Murilo Gomes

Estudante de Engenharia de Software. Site de uma página que conta a trajetória
profissional e acadêmica por rolagem, com tema claro/escuro, PT/EN e animações.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lenis · next-themes

## Como rodar

Precisa do Node.js (versão LTS).

```bash
npm install
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
