"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { profile } from "@/data/profile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const spring = { stiffness: 120, damping: 18, mass: 0.6 };

type Props = {
  alt: string;
};

// Cartão com a foto. Com mouse, ele inclina de leve acompanhando o cursor.
export default function Portrait({ alt }: Props) {
  const reduceMotion = useReducedMotion();
  const hasMouse = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = hasMouse && !reduceMotion;

  // Posição do mouse na janela, de -0.5 (esquerda/topo) a 0.5 (direita/base)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), spring);
  const shiftX = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), spring);
  const shiftY = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), spring);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      mx.set(event.clientX / window.innerWidth - 0.5);
      my.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, mx, my]);

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        x: shiftX,
        y: shiftY,
        transformPerspective: 900,
      }}
      className="relative aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-3xl border border-line bg-surface sm:max-w-[380px] lg:w-[380px] lg:max-w-none xl:w-[460px]"
    >
      {profile.photo ? (
        <Image
          src={profile.photo}
          alt={alt}
          fill
          priority
          // O original tem 1600x2000 (394 KB) e aparece com ~460px de largura.
          // O next/image entrega o tamanho certo para cada tela; qualidade 90
          // mantém a nitidez do rosto. Era a maior perda do Lighthouse na home.
          quality={90}
          sizes="(min-width: 1280px) 460px, (min-width: 640px) 400px, 300px"
          className="object-cover object-top"
        />
      ) : (
        // Espaço reservado enquanto não há foto: grade fina e as iniciais
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-center justify-center bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:32px_32px]"
        >
          <span className="font-display text-8xl font-bold tracking-wider">
            MG
          </span>
        </div>
      )}
    </motion.div>
  );
}
