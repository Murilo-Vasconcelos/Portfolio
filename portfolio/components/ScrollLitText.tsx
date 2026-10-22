"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

function Word({
  word,
  index,
  total,
  progress,
  highlighted,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  highlighted: boolean;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  // A palavra vai da cor "muted" para a cor do texto. Antes era opacidade
  // 0.15 → 1, mas texto quase transparente reprova no contraste (WCAG); a
  // cor "muted" já passa e ainda deixa claro o que falta acender.
  const lit = useTransform(progress, [start, end], [0, 100]);
  const color = useMotionTemplate`color-mix(in srgb, var(--fg) ${lit}%, var(--muted))`;

  return (
    <>
      <motion.span
        style={{ color }}
        className={
          highlighted
            ? "underline decoration-2 underline-offset-[0.2em]"
            : undefined
        }
      >
        {word}
      </motion.span>{" "}
    </>
  );
}

// Parágrafo que "acende" palavra por palavra conforme a pessoa rola a página.
// As palavras em `highlight` ganham um sublinhado.
export default function ScrollLitText({
  text,
  highlight = [],
  className,
}: {
  text: string;
  highlight?: readonly string[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(" ");
  const marked = highlight.map((item) => item.toLowerCase());

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => {
        const clean = word.toLowerCase().replace(/[.,;:!?]/g, "");
        return (
          <Word
            key={index}
            word={word}
            index={index}
            total={words.length}
            progress={scrollYProgress}
            highlighted={marked.includes(clean)}
          />
        );
      })}
    </p>
  );
}
