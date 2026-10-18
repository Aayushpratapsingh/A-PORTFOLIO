"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function ScrollCue({ paused = false }: { paused?: boolean }) {
  return (
    <a className="hero-scroll-cue" href="#about" aria-label="Scroll to enter the portfolio">
      <span className="hero-scroll-cue__circle">
        <motion.span
          animate={paused ? { y: 0 } : { y: [0, 4, 0] }}
          transition={paused ? undefined : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} aria-hidden="true" />
        </motion.span>
        <span className="hero-scroll-cue__arc" aria-hidden="true">SCROLL TO ENTER</span>
      </span>
      <span className="hero-scroll-cue__caption">EXPLORE THE PORTFOLIO</span>
    </a>
  );
}
