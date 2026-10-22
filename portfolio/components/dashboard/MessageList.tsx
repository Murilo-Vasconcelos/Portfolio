import type { Dictionary } from "@/app/[lang]/dictionaries";
import AnsweredToggle from "@/components/dashboard/AnsweredToggle";
import EmptyState from "@/components/EmptyState";
import { htmlLang, type Locale } from "@/lib/i18n";
import { getAuthenticatedClient } from "@/services/auth";
import { listMessages } from "@/services/messages";

type Dict = Dictionary["panel"]["dashboard"]["messages"];

// Data e hora no fuso de Brasília, no formato de cada idioma
function formatDateTime(date: string, lang: Locale) {
  return new Intl.DateTimeFormat(htmlLang[lang], {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(date));
}

export default async function MessageList({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dict;
}) {
  const auth = await getAuthenticatedClient();
  if (!auth) return null;
  const messages = await listMessages(auth.supabase);

  if (messages.length === 0) {
    return <EmptyState title={dict.empty.title} text={dict.empty.text} />;
  }

  const pending = messages.filter((message) => !message.answered).length;

  return (
    <div>
      <dl className="mb-6 flex gap-8">
        <div>
          <dt className="font-display text-xs tracking-[0.25em] text-muted uppercase">
            {dict.total}
          </dt>
          <dd className="font-display text-3xl font-bold">{messages.length}</dd>
        </div>
        <div>
          <dt className="font-display text-xs tracking-[0.25em] text-muted uppercase">
            {dict.pendingCount}
          </dt>
          <dd className="font-display text-3xl font-bold">{pending}</dd>
        </div>
      </dl>

      <ul className="space-y-4">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`rounded-3xl border bg-surface p-6 ${
              message.answered ? "border-line" : "border-fg"
            }`}
          >
            <article className="space-y-4">
              <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-bold [overflow-wrap:anywhere]">
                  {message.name}
                </h3>
                <time
                  dateTime={message.createdAt}
                  className="text-sm text-muted"
                >
                  {formatDateTime(message.createdAt, lang)}
                </time>
              </header>
              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(dict.replySubject)}`}
                className="inline-block text-sm font-semibold [overflow-wrap:anywhere] underline decoration-line decoration-2 underline-offset-4 hover:decoration-fg"
              >
                {message.email}
                <span className="sr-only"> · {dict.reply}</span>
              </a>
              <p className="leading-7 [overflow-wrap:anywhere] whitespace-pre-line">
                {message.message}
              </p>
              <AnsweredToggle
                id={message.id}
                answered={message.answered}
                dict={dict}
              />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
