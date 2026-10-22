"use client";

import { catchError, type ErrorInfo } from "next/error";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Button from "@/components/Button";

type Props = { dict: Dictionary["panel"]["dashboard"]["error"] };

// Erro ao carregar uma parte do painel (banco ou GitHub fora do ar). Só a
// parte que falhou mostra o aviso; o resto do painel continua usável.
function PanelErrorFallback({ dict }: Props, { retry }: ErrorInfo) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-dashed border-fg p-6 sm:p-8"
    >
      <p className="font-display text-2xl font-bold uppercase">{dict.title}</p>
      <p className="mt-3 max-w-xl leading-7 text-muted">{dict.text}</p>
      <Button onClick={() => retry()} className="mt-6">
        {dict.retry}
      </Button>
    </div>
  );
}

export default catchError(PanelErrorFallback);
