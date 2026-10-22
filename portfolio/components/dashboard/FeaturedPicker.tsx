"use client";

import { useActionState, useState } from "react";
import { saveFeatured, type FeaturedState } from "@/actions/dashboard";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Button from "@/components/Button";

type Dict = Dictionary["panel"]["dashboard"]["featured"];
type Option = { slug: string; name: string; language: string | null };

// Lista de repositórios com caixas de seleção. Ao salvar, a home passa a
// mostrar os escolhidos na ordem em que foram marcados.
export default function FeaturedPicker({
  repos,
  initial,
  max,
  dict,
}: {
  repos: Option[];
  initial: string[];
  max: number;
  dict: Dict;
}) {
  const [selected, setSelected] = useState(initial);
  const [state, formAction, pending] = useActionState<FeaturedState, FormData>(
    saveFeatured,
    { status: "idle" },
  );

  function toggle(slug: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, slug] : current.filter((item) => item !== slug),
    );
  }

  const full = selected.length >= max;
  const feedback = {
    saved: { role: "status", text: dict.saved },
    tooMany: { role: "alert", text: dict.tooMany },
    error: { role: "alert", text: dict.error },
  } as const;
  const message = state.status !== "idle" && !pending && feedback[state.status];

  return (
    <form action={formAction}>
      {/* A ordem dos campos escondidos é a ordem em que foram marcados */}
      {selected.map((slug) => (
        <input key={slug} type="hidden" name="slug" value={slug} />
      ))}

      <fieldset>
        <legend className="mb-4 text-sm font-semibold text-muted">
          {dict.selectedCount
            .replace("{count}", String(selected.length))
            .replace("{max}", String(max))}
        </legend>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {repos.map((repo) => {
            const checked = selected.includes(repo.slug);
            return (
              <li key={repo.slug}>
                <label
                  className={`flex h-full cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 ${
                    checked ? "border-fg" : "border-line hover:border-fg"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!checked && full}
                    onChange={(event) =>
                      toggle(repo.slug, event.target.checked)
                    }
                    className="h-4 w-4 accent-current"
                  />
                  <span className="min-w-0">
                    <span className="block font-semibold [overflow-wrap:anywhere]">
                      {repo.name}
                    </span>
                    {repo.language && (
                      <span className="block text-sm text-muted">
                        {repo.language}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" pending={pending} pendingLabel={dict.saving}>
          {dict.save}
        </Button>
        {message && (
          <p
            role={message.role}
            className={`font-semibold ${
              message.role === "alert" ? "text-red-700 dark:text-red-400" : ""
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
