// Aviso de lista vazia, com um link para seguir em frente
export default function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line p-8 text-center sm:p-12">
      <p className="font-display text-2xl font-bold uppercase">{title}</p>
      <p className="mx-auto mt-3 max-w-md leading-7 text-muted">{text}</p>
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-full border border-fg px-6 py-3 text-sm font-semibold transition-colors hover:bg-fg hover:text-bg"
      >
        {action.label} ↗
      </a>
    </div>
  );
}
