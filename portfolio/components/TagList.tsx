// Lista de etiquetas em pílulas (tecnologias, tópicos do GitHub)
export default function TagList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line px-3 py-1 text-xs font-semibold"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
