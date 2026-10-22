import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "@/lib/i18n";
import { getProxySession } from "@/lib/supabase/proxy";

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

// Painel do dono: /pt/dashboard (e o que vier depois) e a tela de login
const panelRoute = /^\/(pt|en)\/(dashboard|login)(\/|$)/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const panel = pathname.match(panelRoute);
  if (panel) return protectPanel(request, panel[1], panel[2]);

  const alreadyHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (alreadyHasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${getLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

// Primeira barreira do painel: quem não está logado e tenta abrir o dashboard
// vai para o login; quem já está logado e abre o login vai para o dashboard.
// A página e cada Server Action conferem o login de novo (services/auth.ts),
// porque o proxy é só uma checagem rápida, não a proteção dos dados.
async function protectPanel(request: NextRequest, lang: string, page: string) {
  const { response, loggedIn } = await getProxySession(request);
  const target =
    page === "dashboard" && !loggedIn
      ? "login"
      : page === "login" && loggedIn
        ? "dashboard"
        : null;
  if (!target) return response;

  const url = request.nextUrl.clone();
  url.pathname = `/${lang}/${target}`;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  // Leva junto os cookies de uma sessão que acabou de ser renovada
  for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}

export const config = {
  // Ignora arquivos internos do Next e qualquer arquivo com extensão
  // (favicon, imagens, o PDF do currículo...)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
