import type { Dictionary } from "@/app/[lang]/dictionaries";
import Reveal from "@/components/Reveal";
import SectionShell from "@/components/SectionShell";

export default function Milestones({
  dict,
}: {
  dict: Dictionary["milestones"];
}) {
  const lastIndex = dict.items.length - 1;

  return (
    <SectionShell
      id="marcos"
      index={dict.index}
      title={dict.title}
      intro={dict.intro}
    >
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.items.map((item, index) => {
          const upcoming = index === lastIndex;
          return (
            <li key={item.title} className="h-full">
              <Reveal delay={0.08 * index} className="h-full">
                <article
                  className={`flex h-full flex-col rounded-3xl p-6 ${
                    upcoming
                      ? "border border-dashed border-fg"
                      : "border border-line bg-surface"
                  }`}
                >
                  <p className="font-display text-sm uppercase tracking-[0.25em] text-muted">
                    {item.when}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-muted">{item.text}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
