"use client";

import { catchError, type ErrorInfo } from "next/error";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Props = {
  dict: Dictionary["projectsPage"]["error"];
  profileUrl: string;
};

// Tela de erro da API do GitHub. É uma fronteira de erro (catchError) em vez
// de um error.tsx porque assim os textos chegam traduzidos do servidor.
// O botão tenta de novo sem recarregar a página: como o erro não fica em
// cache, a nova tentativa chama a API outra vez.
function ApiErrorFallback({ dict, profileUrl }: Props, { retry }: ErrorInfo) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-dashed border-fg p-8 sm:p-12"
    >
      <h2 className="font-display text-3xl leading-tight font-bold uppercase sm:text-5xl">
        {dict.title}
      </h2>
      <p className="mt-4 max-w-xl text-lg leading-8 text-muted">{dict.text}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full border border-fg bg-fg px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-transparent hover:text-fg"
        >
          {dict.retry}
        </button>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-fg"
        >
          {dict.profile} ↗
        </a>
      </div>
    </div>
  );
}

export default catchError(ApiErrorFallback);
