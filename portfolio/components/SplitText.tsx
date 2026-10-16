"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const letter: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

// Mostra o texto letra por letra, cada uma subindo de dentro de uma "máscara".
// Precisa estar dentro de um elemento animado com os estados "hidden" e "show".
// O leitor de tela lê o texto do elemento que envolve (use aria-label nele).
export default function SplitText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.span variants={container} className={`inline-block ${className ?? ""}`}>
      {Array.from(text).map((char, index) => (
        <span
          key={index}
          aria-hidden
          className="inline-block overflow-hidden py-[0.04em] align-bottom"
        >
          <motion.span variants={letter} data-reveal className="inline-block">
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
