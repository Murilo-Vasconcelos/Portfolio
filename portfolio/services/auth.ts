import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseConfig } from "@/lib/supabase/config";

export type CurrentUser = { id: string; email: string };

// Camada de acesso aos dados (DAL) do login: o único lugar que lê a sessão.
// O proxy faz a primeira checagem, mas página e Server Action chamam esta
// função de novo, perto dos dados, como pede o guia de autenticação do Next.
async function readUser(): Promise<CurrentUser | null> {
  // Lê os cookies antes de tudo: assim a página é sempre gerada na hora do
  // acesso, mesmo num build sem Supabase (senão o redirecionamento do build
  // ficaria gravado no HTML estático)
  await cookies();
  if (!supabaseConfig()) return null;
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: String(claims.email ?? "") };
}

// Para páginas do painel: sem login, volta para a tela de login
export async function getCurrentUser(lang: Locale): Promise<CurrentUser> {
  const user = await readUser();
  if (!user) redirect(`/${lang}/login`);
  return user;
}

// Para Server Actions: devolve o cliente já autenticado, ou null
export async function getAuthenticatedClient() {
  const user = await readUser();
  if (!user) return null;
  return { user, supabase: await createServerSupabase() };
}
