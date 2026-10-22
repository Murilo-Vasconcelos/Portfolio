import { cacheLife, cacheTag } from "next/cache";
import { supabaseConfig } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import type { createServerSupabase } from "@/lib/supabase/server";

export const FEATURED_TAG = "featured-repos";
export const FEATURED_MAX = 4;

// Slugs dos repositórios que o dono marcou como destaque, na ordem escolhida.
// Fica em cache até o painel salvar de novo (updateTag em actions/dashboard).
// Sem Supabase, ou se ele falhar, devolve lista vazia e a home mostra os
// repositórios mais recentes.
export async function getFeaturedSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(FEATURED_TAG);

  if (!supabaseConfig()) {
    cacheLife("hours");
    return [];
  }

  const { data, error } = await createPublicClient()
    .from("featured_repos")
    .select("slug")
    .order("position");

  if (error) {
    // Falha não fica guardada: a próxima visita tenta de novo
    cacheLife("seconds");
    return [];
  }
  cacheLife("days");
  return data.map((row) => row.slug);
}

type Client = Awaited<ReturnType<typeof createServerSupabase>>;

// Troca a lista inteira de destaques pela nova escolha
export async function saveFeaturedSlugs(supabase: Client, slugs: string[]) {
  const removed = await supabase
    .from("featured_repos")
    .delete()
    .neq("slug", "");
  if (removed.error) throw new Error(removed.error.message);
  if (slugs.length === 0) return;

  const inserted = await supabase
    .from("featured_repos")
    .insert(slugs.map((slug, position) => ({ slug, position })));
  if (inserted.error) throw new Error(inserted.error.message);
}
