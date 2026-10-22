import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Home e lista de projetos, cada uma nos dois idiomas
const paths = ["", "/projetos"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) => {
    const languages = {
      "pt-BR": `${siteUrl}/pt${path}`,
      "en-US": `${siteUrl}/en${path}`,
    };
    return [
      { url: languages["pt-BR"], alternates: { languages } },
      { url: languages["en-US"], alternates: { languages } },
    ];
  });
}
