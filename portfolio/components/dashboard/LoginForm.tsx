"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/actions/auth";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Button from "@/components/Button";
import type { Locale } from "@/lib/i18n";

const inputClass =
  "w-full rounded-2xl border border-line bg-bg px-4 py-3 text-base outline-none transition-colors focus:border-fg aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";

// Login do dono. A validação dos campos e a conferência da senha acontecem no
// servidor (actions/auth.ts); aqui só mostramos o resultado.
export default function LoginForm({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["panel"]["login"];
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    signIn.bind(null, lang),
    { status: "idle" },
  );
  const errors = state.status === "invalid" ? state.errors : {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div>
        <label htmlFor="login-email" className="mb-2 block font-semibold">
          {dict.email}
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-erro" : undefined}
          className={inputClass}
        />
        {errors.email && (
          <p
            id="login-email-erro"
            className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400"
          >
            {dict.errors[errors.email]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="login-password" className="mb-2 block font-semibold">
          {dict.password}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-erro" : undefined}
          className={inputClass}
        />
        {errors.password && (
          <p
            id="login-password-erro"
            className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400"
          >
            {dict.errors[errors.password]}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        pending={pending}
        pendingLabel={dict.sending}
        className="w-full"
      >
        {dict.submit}
      </Button>

      {(state.status === "wrong" || state.status === "unavailable") &&
        !pending && (
          <p
            role="alert"
            className="rounded-2xl border border-red-600 p-4 font-semibold text-red-700 dark:border-red-400 dark:text-red-400"
          >
            {dict[state.status]}
          </p>
        )}
    </form>
  );
}
