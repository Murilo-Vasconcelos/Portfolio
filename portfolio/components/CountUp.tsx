"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useIntro } from "@/components/IntroProvider";

// Número que sobe de 0 até o valor quando aparece na tela
export default function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ready } = useIntro();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();

  const value = useMotionValue(reduceMotion ? to : 0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (!inView || !ready) return;
    if (reduceMotion) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, ready, reduceMotion, to, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
