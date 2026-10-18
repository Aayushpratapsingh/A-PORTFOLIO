"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { MotionValue } from "framer-motion";

type TiltCardProps = {
  children: ReactNode | ((parallax: { x: MotionValue<number>; y: MotionValue<number> }) => ReactNode);
  className?: string;
};

export default function TiltCard({ children, className }: TiltCardProps) {
  const reducedMotion = useReducedMotion();
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const imageXValue = useMotionValue(0);
  const imageYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rotateYValue, { stiffness: 180, damping: 22 });
  const imageX = useSpring(imageXValue, { stiffness: 160, damping: 24 });
  const imageY = useSpring(imageYValue, { stiffness: 160, damping: 24 });
  const bounds = useRef<DOMRect | null>(null);

  const resetTilt = () => {
    bounds.current = null;
    rotateXValue.set(0);
    rotateYValue.set(0);
    imageXValue.set(0);
    imageYValue.set(0);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (!reducedMotion && event.pointerType !== "touch") {
      bounds.current = event.currentTarget.getBoundingClientRect();
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = bounds.current;
    if (reducedMotion || event.pointerType === "touch" || !rect) return;

    const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
    const vertical = (event.clientY - rect.top) / rect.height - 0.5;
    rotateXValue.set(-vertical * 8);
    rotateYValue.set(horizontal * 8);
    imageXValue.set(-horizontal * 10);
    imageYValue.set(-vertical * 8);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      data-tilt-card
    >
      {typeof children === "function"
        ? children({ x: imageX, y: imageY })
        : children}
    </motion.div>
  );
}
