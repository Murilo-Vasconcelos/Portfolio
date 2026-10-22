"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { Locale } from "@/lib/i18n";
import { supabaseConfig } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";

export type LoginState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: { email?: "emailInvalid"; password?: "passwordRequired" };
    }
  | { status: "wrong" }
  | { status: "unavailable" };

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "emailInvalid" })),
  password: z.string().min(1, { error: "passwordRequired" }),
});

// Login do dono com e-mail e senha (Supabase Auth). O idioma vem por bind()
// para o redirecionamento cair na versão certa do painel.
export async function signIn(
  lang: Locale,
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    const errors: Extract<LoginState, { status: "invalid" }>["errors"] = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "email") errors.email = "emailInvalid";
      if (issue.path[0] === "password") errors.password = "passwordRequired";
    }
    return { status: "invalid", errors };
  }

  if (!supabaseConfig()) return { status: "unavailable" };
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    // 400 = e-mail ou senha errados; o resto é falha do serviço
    return error.status === 400
      ? { status: "wrong" }
      : { status: "unavailable" };
  }

  redirect(`/${lang}/dashboard`);
}

export async function signOut(lang: Locale) {
  if (supabaseConfig()) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect(`/${lang}/login`);
}
