// Esqueleto dos cards de repositório, mostrado enquanto a API responde. A pulsação some para
// quem pediu "reduzir movimento" (motion-safe).
export default function RepoGridSkeleton({
  count,
  label,
}: {
  count: number;
  label: string;
}) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <ul aria-hidden className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: count }, (_, index) => (
          <li
            key={index}
            className="flex h-56 flex-col gap-4 rounded-3xl border border-line bg-surface p-6 motion-safe:animate-pulse"
          >
            <div className="h-3 w-20 rounded-full bg-line" />
            <div className="h-7 w-2/3 rounded-full bg-line" />
            <div className="h-4 w-full rounded-full bg-line" />
            <div className="h-4 w-4/5 rounded-full bg-line" />
            <div className="mt-auto h-4 w-40 rounded-full bg-line" />
          </li>
        ))}
      </ul>
    </div>
  );
}
