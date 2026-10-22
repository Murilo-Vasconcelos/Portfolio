"use client";

import { useActionState, useRef, useState } from "react";
import { sendContactMessage, type ContactState } from "@/actions/contact";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Button from "@/components/Button";
import {
  MESSAGE_MAX,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact";

type Dict = Dictionary["contact"]["form"];

const empty = { name: "", email: "", message: "" };
const fields: ContactField[] = ["name", "email", "message"];

const inputClass =
  "w-full rounded-2xl border bg-bg px-4 py-3 text-base outline-none transition-colors placeholder:text-muted focus:border-fg aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";

// Formulário de contato. Valida no navegador para o erro aparecer na hora,
// mas quem decide é o servidor (actions/contact.ts). Os campos são
// controlados para o texto não sumir quando o envio falha.
export default function ContactForm({ dict }: { dict: Dict }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prev: ContactState, formData: FormData) => {
      const result = await sendContactMessage(prev, formData);
      if (result.status === "invalid") setErrors(result.errors);
      if (result.status === "success") {
        setValues(empty);
        setErrors({});
      }
      return result;
    },
    { status: "idle" },
  );

  // Revalida um campo: ao sair dele, ou enquanto digita se já tinha erro
  function check(field: ContactField, next = values) {
    const result = validateContact(next);
    const error = result.success ? undefined : result.errors[field];
    setErrors((current) => ({ ...current, [field]: error }));
  }

  function change(field: ContactField, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) check(field, next);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    const result = validateContact(values);
    if (result.success) return;
    // Com erro, o envio nem sai do navegador; o foco vai para o 1º campo errado
    event.preventDefault();
    setErrors(result.errors);
    const first = fields.find((field) => result.errors[field]);
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  function errorFor(field: ContactField) {
    const code = errors[field];
    if (!code) return null;
    return (
      <p
        id={`contato-${field}-erro`}
        className="mt-2 text-sm font-semibold text-red-700 dark:text-red-400"
      >
        {dict.errors[code]}
      </p>
    );
  }

  function describedBy(field: ContactField, hint?: string) {
    const ids = [hint, errors[field] && `contato-${field}-erro`];
    return ids.filter(Boolean).join(" ") || undefined;
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={submit}
      noValidate
      className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <h3 className="font-display text-2xl font-bold uppercase">
        {dict.title}
      </h3>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="contato-name" className="mb-2 block font-semibold">
            {dict.name}
          </label>
          <input
            id="contato-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => change("name", event.target.value)}
            onBlur={() => check("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={inputClass}
          />
          {errorFor("name")}
        </div>

        <div>
          <label htmlFor="contato-email" className="mb-2 block font-semibold">
            {dict.email}
          </label>
          <input
            id="contato-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => change("email", event.target.value)}
            onBlur={() => check("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={inputClass}
          />
          {errorFor("email")}
        </div>

        <div>
          <label htmlFor="contato-message" className="mb-2 block font-semibold">
            {dict.message}
          </label>
          <textarea
            id="contato-message"
            name="message"
            rows={5}
            maxLength={MESSAGE_MAX}
            value={values.message}
            onChange={(event) => change("message", event.target.value)}
            onBlur={() => check("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message", "contato-message-dica")}
            className={`${inputClass} resize-y`}
          />
          <p
            id="contato-message-dica"
            className="mt-2 flex justify-between gap-4 text-sm text-muted"
          >
            <span>{dict.messageHint}</span>
            <span aria-hidden>
              {values.message.trim().length}/{MESSAGE_MAX}
            </span>
          </p>
          {errorFor("message")}
        </div>

        {/* Isca para robôs: escondida de quem usa o site, inclusive leitor de tela */}
        <div aria-hidden className="hidden">
          <label htmlFor="contato-website">{dict.honeypot}</label>
          <input
            id="contato-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          pending={pending}
          pendingLabel={dict.sending}
        >
          {dict.submit}
        </Button>
      </div>

      {/* Avisos lidos pelo leitor de tela assim que aparecem */}
      <div aria-live="polite" className="mt-5 empty:hidden">
        {state.status === "success" && !pending && (
          <p
            role="status"
            className="rounded-2xl border border-line p-4 font-semibold"
          >
            {dict.success}
          </p>
        )}
      </div>
      {state.status === "error" && !pending && (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-red-600 p-4 font-semibold text-red-700 dark:border-red-400 dark:text-red-400"
        >
          {dict.error}
        </p>
      )}
    </form>
  );
}
