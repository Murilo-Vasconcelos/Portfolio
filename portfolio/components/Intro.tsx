"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { useIntro } from "@/components/IntroProvider";
import { INTRO_STORAGE_KEY } from "@/lib/intro";

const subscribe = () => () => {};

function readSeen() {
  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // sem armazenamento: a intro só vai aparecer de novo na próxima visita
  }
}

type Props = {
  name: string;
  label: string;
  skipLabel: string;
};

export default function Intro({ name, label, skipLabel }: Props) {
  const { markReady } = useIntro();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  // Quem já viu a intro nesta sessão, ou pediu "reduzir movimento", pula direto
  const seen = useSyncExternalStore(subscribe, readSeen, () => false);
  const skip = seen || Boolean(reduceMotion);

  const [finished, setFinished] = useState(false);
  const showing = !skip && !finished;

  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) =>
    String(Math.round(v)).padStart(2, "0"),
  );
  const barWidth = useTransform(progress, (v) => `${v}%`);

  // A abertura só começa a animar depois que a intro termina (ou é pulada)
  useEffect(() => {
    if (skip || finished) markReady();
  }, [skip, finished, markReady]);

  // Contagem de 0 a 100
  useEffect(() => {
    if (skip || finished) return;
    const controls = animate(progress, 100, {
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        markSeen();
        setFinished(true);
      },
    });
    return () => controls.stop();
  }, [skip, finished, progress]);

  // Trava a rolagem enquanto a intro está na tela
  useEffect(() => {
    if (!lenis || !showing) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, showing]);

  const finish = () => {
    markSeen();
    setFinished(true);
  };

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          key="intro"
          role="status"
          aria-label={label}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="intro-overlay fixed inset-0 z-[200] flex flex-col justify-between bg-[#121212] p-5 text-[#f5f5f5] sm:p-8"
        >
          <div className="flex items-start justify-between">
            <span className="font-display text-sm uppercase tracking-[0.3em]">
              {name}
            </span>
            <button
              type="button"
              onClick={finish}
              className="font-display text-sm uppercase tracking-[0.3em] text-[#a6a6a6] transition-colors hover:text-[#f5f5f5]"
            >
              {skipLabel}
            </button>
          </div>

          <div>
            <div className="flex items-end gap-2 font-display font-bold leading-none">
              <motion.span className="text-[28vw] sm:text-[20vw]">
                {counter}
              </motion.span>
              <span className="pb-[3vw] text-[6vw] text-[#a6a6a6]">%</span>
            </div>
            <div className="mt-4 h-px w-full bg-[#f5f5f5]/20">
              <motion.div
                className="h-full bg-[#f5f5f5]"
                style={{ width: barWidth }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
