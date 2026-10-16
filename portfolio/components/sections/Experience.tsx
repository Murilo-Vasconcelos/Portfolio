import type { Dictionary } from "@/app/[lang]/dictionaries";
import Reveal from "@/components/Reveal";
import SectionShell from "@/components/SectionShell";
import { tools } from "@/data/experience";

export default function Experience({
  dict,
}: {
  dict: Dictionary["experience"];
}) {
  return (
    <SectionShell id="experiencia" index={dict.index} title={dict.title}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        {/* Cargo e empresa, como uma linha de tabela */}
        <Reveal>
          <div className="border-t border-fg pt-5">
            <p className="font-display text-sm uppercase tracking-[0.25em] text-muted">
              {dict.period}
            </p>
            <h3 className="mt-3 font-display text-4xl font-bold uppercase leading-none sm:text-5xl">
              {dict.company}
            </h3>
            <p className="mt-3 text-lg text-muted">{dict.role}</p>

            <p className="mt-8 font-display text-xs uppercase tracking-[0.25em] text-muted">
              {dict.toolsLabel}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-line px-3 py-1 text-sm"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="space-y-6">
          {/* Destaque: TV do RH */}
          <Reveal delay={0.1}>
            <article className="rounded-3xl border border-fg bg-surface p-7 sm:p-10">
              <p className="inline-block rounded-full bg-fg px-3 py-1 font-display text-xs uppercase tracking-[0.25em] text-bg">
                {dict.highlightLabel}
              </p>
              <h3 className="mt-5 font-display text-4xl font-bold uppercase leading-none sm:text-6xl">
                {dict.highlightTitle}
              </h3>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
                {dict.highlightText}
              </p>
            </article>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {dict.items.map((item, index) => (
              <Reveal key={item.title} delay={0.1 * (index + 1)}>
                <article className="h-full rounded-3xl border border-line p-6 transition-colors hover:border-fg">
                  <p className="font-display text-sm text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-3 font-display text-xl font-bold uppercase">
                    {item.title}
                  </h4>
                  <p className="mt-3 leading-7 text-muted">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
