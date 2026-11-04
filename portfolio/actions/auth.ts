"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { defaultLocale, hasLocale } from "@/lib/i18n";
import { clientIp, createRateLimiter } from "@/lib/rateLimit";
import { supabaseConfig } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";

export type LoginState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: { email?: "emailInvalid"; password?: "passwordRequired" };
    }
  | { status: "wrong" }
  | { status: "tooMany" }
  | { status: "unavailable" };

// Até 10 tentativas a cada 10 minutos por IP, contra quem tenta adivinhar a
// senha. O limite do Supabase não basta: para ele, todo login vem do IP da
// Vercel, não do visitante.
const allowAttempt = createRateLimiter({ limit: 10, windowMs: 10 * 60_000 });

// O idioma chega pelo navegador (bind), então só aceita pt ou en: assim o
// redirecionamento nunca aponta para fora do site
function safeLocale(lang: string) {
  return hasLocale(lang) ? lang : defaultLocale;
}

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
  lang: string,
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
  if (!allowAttempt(clientIp(await headers()))) return { status: "tooMany" };
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    // 400 = e-mail ou senha errados; o resto é falha do serviço
    return error.status === 400
      ? { status: "wrong" }
      : { status: "unavailable" };
  }

  redirect(`/${safeLocale(lang)}/dashboard`);
}

export async function signOut(lang: string) {
  if (supabaseConfig()) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect(`/${safeLocale(lang)}/login`);
}
