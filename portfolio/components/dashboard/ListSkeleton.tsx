// Esqueleto de uma lista do painel enquanto os dados chegam
export default function ListSkeleton({
  label,
  rows = 3,
}: {
  label: string;
  rows?: number;
}) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <ul aria-hidden className="space-y-4">
        {Array.from({ length: rows }, (_, index) => (
          <li
            key={index}
            className="space-y-3 rounded-3xl border border-line bg-surface p-6 motion-safe:animate-pulse"
          >
            <div className="h-4 w-40 rounded-full bg-line" />
            <div className="h-3 w-56 rounded-full bg-line" />
            <div className="h-4 w-full rounded-full bg-line" />
            <div className="h-4 w-2/3 rounded-full bg-line" />
          </li>
        ))}
      </ul>
    </div>
  );
}
