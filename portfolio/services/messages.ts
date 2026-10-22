import type { ContactInput } from "@/lib/contact";
import { createPublicClient } from "@/lib/supabase/public";
import type { createServerSupabase } from "@/lib/supabase/server";

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

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  answered: boolean;
  createdAt: string;
};

type Client = Awaited<ReturnType<typeof createServerSupabase>>;

// Mensagens para o painel, das mais novas para as mais antigas. Recebe o
// cliente logado: sem sessão, a política de RLS não devolve nada.
export async function listMessages(supabase: Client): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, name, email, message, answered, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error)
    throw new Error(`Não foi possível ler as mensagens: ${error.message}`);
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    answered: row.answered,
    createdAt: row.created_at,
  }));
}

export async function setMessageAnswered(
  supabase: Client,
  id: string,
  answered: boolean,
) {
  const { error } = await supabase
    .from("messages")
    .update({ answered })
    .eq("id", id);
  if (error) throw new Error(`Não foi possível atualizar: ${error.message}`);
}
