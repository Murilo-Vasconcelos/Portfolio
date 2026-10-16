// Tecnologias que você conhece e usa. Para acrescentar uma, coloque o logo em
// data/skillIcons.ts e a inclua no grupo certo aqui.
// Os nomes das tecnologias são os mesmos nos dois idiomas; só os títulos dos
// grupos ficam nos dicionários (pt.json e en.json).

export const skillGroups = [
  {
    id: "languages",
    items: [
      { id: "java", name: "Java" },
      { id: "python", name: "Python" },
      { id: "cpp", name: "C++" },
      { id: "javascript", name: "JavaScript" },
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
    id: "dataCloud",
    items: [
      { id: "sql", name: "SQL" },
      { id: "mysql", name: "MySQL" },
      { id: "aws", name: "AWS" },
      { id: "azure", name: "Microsoft Azure", note: "DP-900" },
    ],
  },
  {
    id: "design",
    items: [
      { id: "figma", name: "Figma" },
      { id: "canva", name: "Canva" },
    ],
  },
] as const;

export type SkillGroupId = (typeof skillGroups)[number]["id"];
