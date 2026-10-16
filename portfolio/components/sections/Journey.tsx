"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import Reveal from "@/components/Reveal";
import ScrollLitText from "@/components/ScrollLitText";

type Item = Dictionary["journey"]["items"][number];

function TimelineItem({
  item,
  index,
  isLast,
  nowLabel,
}: {
  item: Item;
  index: number;
  isLast: boolean;
  nowLabel: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Acende quando o marco passa pelo meio da tela
  const active = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const right = index % 2 === 1;

  return (
    <li
      ref={ref}
      className={`relative pb-14 pl-9 last:pb-0 md:w-1/2 md:pb-16 ${
        right ? "md:ml-auto md:pl-14" : "md:pl-0 md:pr-14 md:text-right"
      }`}
    >
      {/* Bolinha na linha */}
      <span
        aria-hidden
        className={`absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-fg transition-colors duration-500 ${
          active || isLast ? "bg-fg" : "bg-bg"
        } ${right ? "md:left-0 md:-translate-x-1/2" : "md:left-auto md:right-0 md:translate-x-1/2"}`}
      >
        {isLast && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fg opacity-40" />
        )}
      </span>

      <Reveal y={24}>
        <p className="font-display text-sm uppercase tracking-[0.25em] text-muted">
          {item.when}
          {isLast && (
            <span className="ml-3 rounded-full border border-line px-2 py-0.5 text-[0.65rem] tracking-[0.2em]">
              {nowLabel}
            </span>
          )}
        </p>
        <h3
          className={`mt-2 font-display text-2xl font-bold uppercase transition-opacity duration-500 sm:text-3xl ${
            active || isLast ? "opacity-100" : "opacity-60"
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-2 leading-7 text-muted">{item.text}</p>
      </Reveal>
    </li>
  );
}

export default function Journey({ dict }: { dict: Dictionary["journey"] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.6", "end 0.6"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <section id="jornada" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="font-display text-sm uppercase tracking-[0.3em] text-muted">
            {dict.index} /
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-3 font-display text-[clamp(2rem,9vw,6.5rem)] [overflow-wrap:anywhere] font-bold uppercase leading-none">
            {dict.title}
          </h2>
        </Reveal>

        <ScrollLitText
          text={dict.statement}
          highlight={dict.statementHighlight}
          className="mt-12 max-w-4xl font-display text-3xl font-bold leading-tight sm:mt-16 sm:text-5xl"
        />

        {/* Linha do tempo: a linha se desenha conforme a rolagem */}
        <ol ref={listRef} className="relative mt-20 sm:mt-28">
          <span
            aria-hidden
            className="absolute bottom-0 left-[6.5px] top-0 w-[2px] bg-line md:left-1/2 md:-translate-x-1/2"
          />
          <motion.span
            aria-hidden
            data-reveal
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute bottom-0 left-[6.5px] top-0 w-[2px] bg-fg md:left-1/2 md:-translate-x-1/2"
          />
          {dict.items.map((item, index) => (
            <TimelineItem
              key={item.title}
              item={item}
              index={index}
              isLast={index === dict.items.length - 1}
              nowLabel={dict.nowLabel}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
