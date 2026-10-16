import Reveal from "@/components/Reveal";

// Moldura comum das seções: linha no topo, número, título gigante e uma
// frase de apoio opcional.
export default function SectionShell({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="mb-12 sm:mb-16">
          <Reveal>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-muted">
              {index} /
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-display text-[clamp(2rem,9vw,6.5rem)] [overflow-wrap:anywhere] font-bold uppercase leading-none">
              {title}
            </h2>
          </Reveal>
          {intro && (
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                {intro}
              </p>
            </Reveal>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
