"use client";

import { useFormStatus } from "react-dom";
import { signOut } from "@/actions/auth";
import Button from "@/components/Button";
import type { Locale } from "@/lib/i18n";

function Submit({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      pending={pending}
      pendingLabel={pendingLabel}
      className="px-3 py-2 text-xs sm:px-4 sm:text-sm"
    >
      {label}
    </Button>
  );
}

export default function LogoutButton({
  lang,
  label,
  pendingLabel,
}: {
  lang: Locale;
  label: string;
  pendingLabel: string;
}) {
  return (
    <form action={signOut.bind(null, lang)}>
      <Submit label={label} pendingLabel={pendingLabel} />
    </form>
  );
}
