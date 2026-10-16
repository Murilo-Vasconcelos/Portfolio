"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useMediaQuery } from "@/lib/useMediaQuery";

// Card que inclina em 3D seguindo o mouse.
// Com `label`, uma etiqueta pequena acompanha o cursor dentro do card.
export default function TiltCard({
  children,
  className,
  label,
  maxTilt = 8,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasMouse = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useReducedMotion();
  const enabled = hasMouse && !reduceMotion;
  const [hovering, setHovering] = useState(false);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const labelX = useMotionValue(0);
  const labelY = useMotionValue(0);

  const onMove = (event: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * maxTilt * 2);
    rotateX.set(-py * maxTilt * 2);
    labelX.set(event.clientX - rect.left);
    labelY.set(event.clientY - rect.top);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`relative ${className ?? ""}`}
    >
      {children}

      {label && enabled && (
        <motion.span
          aria-hidden
          style={{ x: labelX, y: labelY }}
          animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute left-0 top-0 z-20 translate-x-5 translate-y-5 whitespace-nowrap rounded-full bg-fg px-3 py-1 text-xs font-semibold text-bg"
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
