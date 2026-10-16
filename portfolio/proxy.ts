import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/lib/i18n";

// Escolhe o idioma pela configuração do navegador de quem visita:
// quem usa o navegador em português vai para /pt, em inglês vai para /en.
// Qualquer outro caso cai no português.
function getLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";

  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    const base = tag.split("-")[0];
    if (hasLocale(base)) return base;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const alreadyHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (alreadyHasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${getLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Ignora arquivos internos do Next e qualquer arquivo com extensão
  // (favicon, imagens, o PDF do currículo...)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
