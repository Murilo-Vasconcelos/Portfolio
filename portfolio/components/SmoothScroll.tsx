"use client";

import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

// Rolagem com inércia em toda a página. Quem pediu "reduzir movimento" no
// sistema continua com a rolagem normal do navegador.
// Com anchors ligado, os links como #jornada também descem suavemente.
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, smoothWheel: !reduceMotion, anchors: true }}
    >
      {children}
    </ReactLenis>
  );
}
