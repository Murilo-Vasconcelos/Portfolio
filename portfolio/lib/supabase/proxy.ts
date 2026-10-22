import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "./config";

// Usado pelo proxy.ts nas rotas do painel: confere se há alguém logado e
// renova o token quando ele está para vencer, gravando os cookies novos na
// resposta. Sem Supabase configurado, ninguém está logado.
export async function getProxySession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = supabaseConfig();
  if (!config) return { response, loggedIn: false };

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // getClaims valida a assinatura do token; não confie só no cookie
  const { data } = await supabase.auth.getClaims();
  return { response, loggedIn: Boolean(data?.claims.sub) };
}
