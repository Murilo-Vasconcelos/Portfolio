"use client";

import { motion, type Variants } from "framer-motion";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { buttonClasses } from "@/components/Button";
import CountUp from "@/components/CountUp";
import HeroRings from "@/components/HeroRings";
import { useIntro } from "@/components/IntroProvider";
import Portrait from "@/components/Portrait";
import SplitText from "@/components/SplitText";
import { profile } from "@/data/profile";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({ dict }: { dict: Dictionary["hero"] }) {
  const { ready } = useIntro();
  const fullName = `${dict.firstName} ${dict.lastName}`;

  const socials = [
    { label: dict.links.linkedin, href: profile.links.linkedin },
    { label: dict.links.github, href: profile.links.github },
    ...(profile.links.email
      ? [{ label: dict.links.email, href: `mailto:${profile.links.email}` }]
      : []),
  ];

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pt-28 pb-28 sm:px-8"
    >
      <HeroRings />

      <motion.div
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        variants={stagger}
        className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16"
      >
        {/* Foto, com o texto vertical ao lado no desktop */}
        <motion.div
          variants={fadeUp}
          data-reveal
          className="flex items-center justify-center gap-6"
        >
          <p className="hidden rotate-180 border-r border-line pr-4 font-display text-sm tracking-[0.4em] text-muted uppercase [writing-mode:vertical-rl] lg:block">
            {dict.role}
          </p>
          <Portrait alt={dict.photoAlt} />
        </motion.div>

        {/* Nome, texto e botões */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.p
            variants={fadeUp}
            data-reveal
            className="mb-4 font-display text-sm tracking-[0.3em] text-muted uppercase lg:hidden"
          >
            {dict.role}
          </motion.p>

          <h1
            aria-label={fullName}
            className="font-display text-[clamp(3.5rem,13vw,9.5rem)] leading-[0.9] font-bold uppercase"
          >
            <span className="block">
              <SplitText text={dict.firstName} />
            </span>
            <span className="text-outline block">
              <SplitText text={dict.lastName} />
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            data-reveal
            className="mt-6 max-w-md text-lg leading-8 text-muted"
          >
            {dict.tagline}
          </motion.p>

          <motion.div
            variants={fadeUp}
            data-reveal
            className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            <a href={profile.resume} download className={buttonClasses()}>
              {dict.resume}
            </a>
            <a
              href="#jornada"
              className={buttonClasses({ variant: "secondary" })}
            >
              {dict.journey}
            </a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            data-reveal
            className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold lg:justify-start"
          >
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-fg"
                >
                  {social.label} ↗
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Números que sobem */}
        <motion.dl
          variants={fadeUp}
          data-reveal
          className="grid grid-cols-3 gap-4 border-t border-line pt-6 lg:col-span-2"
        >
          {profile.stats.map((stat) => (
            <div key={stat.id} className="flex flex-col-reverse gap-1">
              <dt className="text-xs text-muted sm:text-sm">
                {dict.stats[stat.id]}
              </dt>
              <dd className="font-display text-4xl font-bold sm:text-6xl">
                <CountUp to={stat.value} />
                {stat.suffix}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Indicador de rolagem */}
      <motion.a
        href="#jornada"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        data-reveal
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted"
      >
        {dict.scroll}
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="scroll-cue-dot absolute inset-x-0 top-0 h-1/2 bg-fg" />
        </span>
      </motion.a>
    </section>
  );
}
