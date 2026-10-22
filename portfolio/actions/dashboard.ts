"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { getAuthenticatedClient } from "@/services/auth";
import {
  FEATURED_MAX,
  FEATURED_TAG,
  saveFeaturedSlugs,
} from "@/services/featured";
import { setMessageAnswered } from "@/services/messages";

// Ações do painel. Cada uma confere o login de novo: o botão só aparece para
// quem está logado, mas uma Server Action pode ser chamada por qualquer um.

export async function toggleAnswered(id: string, answered: boolean) {
  const auth = await getAuthenticatedClient();
  if (!auth) return { ok: false };
  if (!z.uuid().safeParse(id).success) return { ok: false };

  try {
    await setMessageAnswered(auth.supabase, id, answered);
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
  refresh();
  return { ok: true };
}

export type FeaturedState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "tooMany" }
  | { status: "error" };

const slugsSchema = z
  .array(z.string().regex(/^[a-z0-9._-]{1,100}$/))
  .max(FEATURED_MAX);

export async function saveFeatured(
  _prev: FeaturedState,
  formData: FormData,
): Promise<FeaturedState> {
  const auth = await getAuthenticatedClient();
  if (!auth) return { status: "error" };

  const parsed = slugsSchema.safeParse(formData.getAll("slug").map(String));
  if (!parsed.success) {
    return formData.getAll("slug").length > FEATURED_MAX
      ? { status: "tooMany" }
      : { status: "error" };
  }

  try {
    await saveFeaturedSlugs(auth.supabase, parsed.data);
  } catch (error) {
    console.error(error);
    return { status: "error" };
  }
  // A home mostra a escolha nova já no próximo acesso
  updateTag(FEATURED_TAG);
  return { status: "saved" };
}
