import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig, SupabaseNotConfiguredError } from "./config";

// Cliente com a sessão de quem está logado (lida dos cookies). Só para
// Server Components, Server Actions e Route Handlers. Os cookies só podem ser
// gravados em Server Actions; nos componentes a gravação é ignorada e quem
// renova a sessão é o proxy.
export async function createServerSupabase() {
  const config = supabaseConfig();
  if (!config) throw new SupabaseNotConfiguredError();
  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Chamado durante a renderização de um Server Component: o proxy
          // já cuida de renovar a sessão nesse caso.
        }
      },
    },
  });
}
