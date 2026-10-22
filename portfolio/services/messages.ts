import type { ContactInput } from "@/lib/contact";
import { createPublicClient } from "@/lib/supabase/public";

// Grava a mensagem do formulário no Supabase. A política de RLS só deixa o
// visitante inserir; ler e marcar como respondida é coisa do painel.
export async function saveMessage(input: ContactInput) {
  const supabase = createPublicClient();
  const { error } = await supabase.from("messages").insert({
    name: input.name,
    email: input.email,
    message: input.message,
  });
  if (error) throw new Error(`Supabase recusou a mensagem: ${error.message}`);
}
