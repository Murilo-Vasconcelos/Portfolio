import type { Dictionary } from "@/app/[lang]/dictionaries";
import { buttonClasses } from "@/components/Button";
import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";

export default function Contact({
  dict,
  hero,
}: {
  dict: Dictionary["contact"];
  hero: Dictionary["hero"];
}) {
  const links = [
    { label: hero.links.linkedin, href: profile.links.linkedin },
    { label: hero.links.github, href: profile.links.github },
    ...(profile.links.email
      ? [{ label: hero.links.email, href: `mailto:${profile.links.email}` }]
      : []),
  ];

  return (
    <section id="contato" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
        <Reveal>
          <p className="font-display text-sm tracking-[0.3em] text-muted uppercase">
            {dict.index} / {dict.title}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-3 font-display text-[clamp(2.25rem,11.5vw,9rem)] leading-[0.9] font-bold [overflow-wrap:anywhere] uppercase">
            {dict.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            {dict.text}
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Magnetic>
              <a
                href={profile.resume}
                download
                className={buttonClasses({ size: "lg" })}
              >
                {dict.resume}
              </a>
            </Magnetic>
            {links.map((link) => (
              <Magnetic key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={buttonClasses({
                    variant: "secondary",
                    size: "lg",
                  })}
                >
                  {link.label} ↗
                </a>
              </Magnetic>
            ))}
          </div>
        </Reveal>

        <footer className="mt-24 flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {hero.firstName} {hero.lastName}. {dict.footer}
          </p>
          <a
            href="#inicio"
            className="font-semibold text-fg underline decoration-line decoration-2 underline-offset-4 hover:decoration-fg"
          >
            {dict.top} ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
