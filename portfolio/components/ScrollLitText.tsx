"use client";

import { useRef } from "react";
import {
  motion,
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
  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <>
      <motion.span
        data-reveal
        style={{ opacity }}
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
