"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type HudLabelProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function HudLabel({
  children,
  className = "",
  delay = 0,
}: HudLabelProps) {
  return (
    <motion.div
      className={`hero-hud ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
