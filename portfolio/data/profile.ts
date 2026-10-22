// Dados do perfil que aparecem em mais de um lugar do site.
// Para atualizar algo (foto, currículo, números), é só mexer aqui.

export const profile = {
  // Caminho da sua foto dentro da pasta public, por exemplo "/images/murilo.jpg".
  // Enquanto estiver null, aparece um espaço reservado com as iniciais.
  photo: "/images/murilo.webp" as string | null,

  // PDF do currículo, dentro da pasta public. Para atualizar, troque o arquivo.
  resume: "/curriculo-murilo.pdf",

  links: {
    linkedin: "https://www.linkedin.com/in/murilo-gomes-a0703526a",
    github: "https://github.com/Murilo-Vasconcelos",
    // Deixe vazio para esconder o link de e-mail
    email: "murilovasc.gomes@gmail.com",
  },

  // Números que sobem na abertura. Atualize quando tiver novidade.
  stats: [
    { id: "certifications", value: 9, suffix: "" },
    { id: "projects", value: 5, suffix: "" },
    { id: "years", value: 3, suffix: "+" },
  ],
} as const;
