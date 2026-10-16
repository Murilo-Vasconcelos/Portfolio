import type { Dictionary } from "@/app/[lang]/dictionaries";
import Reveal from "@/components/Reveal";
import SectionShell from "@/components/SectionShell";
import SkillIcon from "@/components/SkillIcon";
import { skillGroups } from "@/data/skills";

export default function Skills({ dict }: { dict: Dictionary["skills"] }) {
  return (
    <SectionShell
      id="skills"
      index={dict.index}
      title={dict.title}
      intro={dict.intro}
    >
      <div className="space-y-12">
        {skillGroups.map((group, groupIndex) => (
          <div key={group.id}>
            <Reveal delay={0.05 * groupIndex}>
              <h3 className="mb-5 flex items-center gap-4 font-display text-sm uppercase tracking-[0.25em] text-muted">
                {dict.groups[group.id]}
                <span aria-hidden className="h-px flex-1 bg-line" />
              </h3>
            </Reveal>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {group.items.map((item, index) => (
                <li key={item.id}>
                  <Reveal delay={0.06 * index} y={20} className="h-full">
                    <div
                      data-cursor
                      className="group flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-line bg-surface px-4 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-fg hover:bg-fg hover:text-bg"
                    >
                      <SkillIcon
                        id={item.id}
                        className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="flex flex-col gap-0.5 text-sm font-semibold">
                        {item.name}
                        {"note" in item && (
                          <span className="text-xs font-normal opacity-70">
                            {item.note}
                          </span>
                        )}
                      </span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
