import { createClient } from "@supabase/supabase-js";
import { supabaseConfig, SupabaseNotConfiguredError } from "./config";

// Cliente sem sessão, como um visitante anônimo. Serve para o que qualquer um
// pode fazer (enviar mensagem, ler os destaques) e pode ser usado dentro de
// "use cache", porque não lê cookies.
export function createPublicClient() {
  const config = supabaseConfig();
  if (!config) throw new SupabaseNotConfiguredError();
  return createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
