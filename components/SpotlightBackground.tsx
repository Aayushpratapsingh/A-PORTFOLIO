"use client";

import { useEffect, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type SpotlightBackgroundProps = {
  containerRef: RefObject<HTMLElement | null>;
};

export default function SpotlightBackground({
  containerRef,
}: SpotlightBackgroundProps) {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 55, damping: 22, mass: 0.8 });
  const y = useSpring(pointerY, { stiffness: 55, damping: 22, mass: 0.8 });

  useEffect(() => {
    const container = containerRef.current;
    const canTrackPointer = window.matchMedia("(pointer: fine)").matches;
    if (!container || reducedMotion || !canTrackPointer) return;

    let bounds = container.getBoundingClientRect();
    const updateBounds = () => {
      bounds = container.getBoundingClientRect();
    };
    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX - bounds.left);
      pointerY.set(event.clientY - bounds.top);
    };

    updateBounds();
    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", updateBounds, { passive: true });
    window.addEventListener("scroll", updateBounds, { passive: true });

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
    };
  }, [containerRef, pointerX, pointerY, reducedMotion]);

  return (
    <div className="hero-atmosphere" aria-hidden="true">
      <div className="hero-atmosphere__grid" />
      <div className="hero-atmosphere__orb hero-atmosphere__orb--one" />
      <div className="hero-atmosphere__orb hero-atmosphere__orb--two" />
      <motion.div className="hero-atmosphere__spotlight" style={{ x, y }} />
    </div>
  );
}
