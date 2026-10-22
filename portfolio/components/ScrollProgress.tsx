"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

// Barra fina no topo que cresce conforme a página é percorrida
export default function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduceMotion ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-fg"
    />
  );
}
