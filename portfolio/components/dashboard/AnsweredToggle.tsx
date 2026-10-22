"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleAnswered } from "@/actions/dashboard";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Button from "@/components/Button";

type Dict = Dictionary["panel"]["dashboard"]["messages"];

// Marca a mensagem como respondida (ou volta para pendente). A etiqueta muda
// na hora (otimista); se o servidor recusar, volta e mostra o erro.
export default function AnsweredToggle({
  id,
  answered,
  dict,
}: {
  id: string;
  answered: boolean;
  dict: Dict;
}) {
  const [optimistic, setOptimistic] = useOptimistic(answered);
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function toggle() {
    setFailed(false);
    startTransition(async () => {
      setOptimistic(!optimistic);
      const result = await toggleAnswered(id, !optimistic);
      if (!result.ok) setFailed(true);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`rounded-full px-3 py-1 font-display text-xs tracking-[0.2em] uppercase ${
          optimistic ? "border border-line text-muted" : "bg-fg text-bg"
        }`}
      >
        {optimistic ? dict.answered : dict.pending}
      </span>
      <Button
        variant="secondary"
        onClick={toggle}
        pending={pending}
        pendingLabel={dict.saving}
        className="px-4 py-2"
      >
        {optimistic ? dict.markPending : dict.markAnswered}
      </Button>
      {failed && (
        <p
          role="alert"
          className="text-sm font-semibold text-red-700 dark:text-red-400"
        >
          {dict.toggleError}
        </p>
      )}
    </div>
  );
}
