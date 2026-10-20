// Só aparecem aqui as tecnologias que realmente foram usadas nos projetos do
// site (data/projects.ts). Para acrescentar uma, coloque o logo em
// data/skillIcons.ts e a inclua no grupo certo.
// Os nomes das tecnologias são os mesmos nos dois idiomas; só os títulos dos
// grupos ficam nos dicionários (pt.json e en.json).

export const skillGroups = [
  {
    id: "languages",
    items: [
      { id: "python", name: "Python" },
      { id: "cpp", name: "C++" },
      { id: "typescript", name: "TypeScript" },
    ],
  },
  {
    id: "frontend",
    items: [
      { id: "html", name: "HTML" },
      { id: "css", name: "CSS" },
      { id: "tailwind", name: "Tailwind CSS" },
      { id: "nextjs", name: "Next.js" },
    ],
  },
  {
    id: "data",
    items: [
      { id: "sql", name: "SQL" },
      { id: "mysql", name: "MySQL" },
    ],
  },
] as const;

export type SkillGroupId = (typeof skillGroups)[number]["id"];
