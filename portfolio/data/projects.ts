// Dados dos projetos que não mudam de idioma (links, imagens e tecnologias).
// Para colocar uma imagem num projeto, salve o print em public/images/projects/
// e acrescente `image: { src, width, height }` ao projeto (e `imageAlt` nos
// dicionários pt.json e en.json).
// Os textos de cada projeto ficam nos dicionários, em pt.json e en.json.

export const projects = [
  {
    id: "revi",
    featured: true,
    // Repositório ainda privado até sair o resultado do NEXT 2026.
    // Quando puder divulgar, coloque o link aqui e o botão "Ver código" aparece.
    repo: null as string | null,
    tech: ["OCR", "Gemini API", "Back-end"],
  },
  {
    id: "gs",
    featured: false,
    // Vídeo curto da simulação no Wokwi; o print abaixo aparece antes de dar play.
    image: {
      src: "/images/projects/global-solution.webp",
      width: 1280,
      height: 778,
    },
    video: "/videos/global-solution.mp4",
    repo: "https://github.com/Murilo-Vasconcelos/GS-Edge-Computing" as
      | string
      | null,
    tech: ["Arduino Uno", "C++", "LCD I2C", "Wokwi"],
  },
  {
    id: "gogames",
    featured: false,
    image: { src: "/images/projects/gogames.webp", width: 1611, height: 1440 },
    repo: "https://github.com/Murilo-Vasconcelos/Projeto-GoGames" as
      | string
      | null,
    tech: ["Python", "Clean Code"],
  },
  {
    id: "tcc",
    featured: false,
    image: { src: "/images/projects/tcc.webp", width: 1923, height: 1533 },
    repo: "https://github.com/Murilo-Vasconcelos/Projeto-TCC" as string | null,
    tech: ["Python", "OpenCV", "face-recognition", "Pillow", "NumPy", "SQL", "MySQL"],
  },
  {
    id: "portfolio",
    featured: false,
    image: { src: "/images/projects/portfolio.webp", width: 1440, height: 900 },
    // Coloque aqui o link do repositório deste portfólio no GitHub.
    repo: null as string | null,
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS"],
  },
] as const;

export type ProjectId = (typeof projects)[number]["id"];

// Equipe do REVI. Sem link = é você.
export const reviTeam: { name: string; url: string | null }[] = [
  { name: "Murilo Gomes", url: null },
  { name: "Erick Nathan", url: "https://www.linkedin.com/in/ericknathan/" },
  {
    name: "Enzo Abreu",
    url: "https://www.linkedin.com/in/enzo-ribeiro-abreu-700024288/",
  },
  {
    name: "Henrique Bueno",
    url: "https://www.linkedin.com/in/henrique-cbueno/",
  },
  {
    name: "Állex Brandão",
    url: "https://www.linkedin.com/in/%C3%A1llex-brand%C3%A3o/",
  },
];
