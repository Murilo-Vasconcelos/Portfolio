import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/pt`,
      alternates: {
        languages: { "pt-BR": `${siteUrl}/pt`, "en-US": `${siteUrl}/en` },
      },
    },
    {
      url: `${siteUrl}/en`,
      alternates: {
        languages: { "pt-BR": `${siteUrl}/pt`, "en-US": `${siteUrl}/en` },
      },
    },
  ];
}
