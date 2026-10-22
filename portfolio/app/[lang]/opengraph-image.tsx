import { ImageResponse } from "next/og";
import { hasLocale, locales } from "@/lib/i18n";
import { getDictionary } from "./dictionaries";

export const alt = "Murilo Gomes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Imagem que aparece quando o link do site é compartilhado (LinkedIn, WhatsApp...)
export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(hasLocale(lang) ? lang : "pt");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#121212",
        color: "#f5f5f5",
        padding: 72,
      }}
    >
      <div
        style={{
          fontSize: 28,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: "#a6a6a6",
        }}
      >
        {dict.hero.role}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 190,
            fontWeight: 800,
            lineHeight: 0.95,
            textTransform: "uppercase",
          }}
        >
          {dict.hero.firstName}
        </div>
        <div
          style={{
            fontSize: 190,
            fontWeight: 800,
            lineHeight: 0.95,
            textTransform: "uppercase",
            color: "transparent",
            WebkitTextStroke: "3px #f5f5f5",
          }}
        >
          {dict.hero.lastName}
        </div>
      </div>
      <div style={{ fontSize: 28, color: "#a6a6a6" }}>{dict.hero.badge}</div>
    </div>,
    size,
  );
}
