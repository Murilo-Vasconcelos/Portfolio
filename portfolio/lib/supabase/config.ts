// Endereço e chave pública do projeto no Supabase. A chave "publishable" pode
// ir para o navegador: quem protege os dados são as políticas de RLS do banco
// (supabase/migrations). Sem as variáveis, o site funciona e só o formulário e
// o painel avisam que estão indisponíveis.
export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url, key } : null;
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super("Supabase não configurado (veja .env.example)");
    this.name = "SupabaseNotConfiguredError";
  }
}
