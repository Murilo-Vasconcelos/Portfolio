// Dados dos projetos que não mudam de idioma (links e tecnologias).
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
    repo: "https://github.com/Murilo-Vasconcelos/GS-Edge-Computing" as
      | string
      | null,
    tech: ["Arduino Uno", "C++", "LCD I2C", "Wokwi"],
  },
  {
    id: "gogames",
    featured: false,
    repo: "https://github.com/Murilo-Vasconcelos/Projeto-GoGames" as
      | string
      | null,
    tech: ["Python", "Clean Code"],
  },
  {
    id: "tcc",
    featured: false,
    repo: "https://github.com/Murilo-Vasconcelos/Projeto-TCC" as string | null,
    tech: ["Python", "OpenCV", "face-recognition", "Pillow", "NumPy"],
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
