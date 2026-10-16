import type { Dictionary } from "@/app/[lang]/dictionaries";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import SectionShell from "@/components/SectionShell";

export default function Certifications({
  dict,
}: {
  dict: Dictionary["certifications"];
}) {
  return (
    <SectionShell
      id="certificacoes"
      index={dict.index}
      title={dict.title}
      intro={dict.intro}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.groups.map((group, index) => (
          <Reveal key={group.title} delay={0.08 * index} className="h-full">
            <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-fg">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-bold uppercase">
                  {group.title}
                </h3>
                <span className="font-display text-3xl font-bold text-muted">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="mt-6 space-y-5">
                {group.items.map((item) => (
                  <li key={item.name} className="border-t border-line pt-4">
                    <p className="font-semibold leading-snug">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">{item.org}</p>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Faixas infinitas, em sentidos opostos */}
      <div className="-mx-5 mt-20 space-y-4 sm:-mx-8">
        <Marquee items={dict.marquee} />
        <Marquee items={[...dict.marquee].reverse()} reverse outline />
      </div>
    </SectionShell>
  );
}
