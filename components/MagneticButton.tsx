"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { PointerEvent } from "react";

type MagneticButtonProps = Omit<
  HTMLMotionProps<"a">,
  "onPointerEnter" | "onPointerLeave" | "onPointerMove"
> & {
  onPointerEnter?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLAnchorElement>) => void;
};

export default function MagneticButton({
  children,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  ...props
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion();
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const x = useSpring(offsetX, { stiffness: 240, damping: 18, mass: 0.35 });
  const y = useSpring(offsetY, { stiffness: 240, damping: 18, mass: 0.35 });
  const bounds = useRef<DOMRect | null>(null);

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    bounds.current = event.currentTarget.getBoundingClientRect();
    onPointerEnter?.(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!reducedMotion && event.pointerType !== "touch" && bounds.current) {
      const { left, top, width, height } = bounds.current;
      offsetX.set(Math.max(-8, Math.min(8, (event.clientX - left - width / 2) * 0.18)));
      offsetY.set(Math.max(-8, Math.min(8, (event.clientY - top - height / 2) * 0.18)));
    }
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    bounds.current = null;
    offsetX.set(0);
    offsetY.set(0);
    onPointerLeave?.(event);
  };

  return (
    <motion.a
      {...props}
      style={{ ...props.style, x, y }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.a>
  );
}
