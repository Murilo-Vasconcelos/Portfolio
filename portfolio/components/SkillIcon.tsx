import { skillIcons } from "@/data/skillIcons";

// Logo de uma tecnologia. Usa a cor do texto (currentColor).
export default function SkillIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const icon = skillIcons[id];
  if (!icon) return null;

  return (
    <svg
      viewBox={icon.viewBox}
      fill="currentColor"
      fillRule={icon.evenodd ? "evenodd" : undefined}
      aria-hidden
      focusable="false"
      className={className}
    >
      {icon.paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
}
