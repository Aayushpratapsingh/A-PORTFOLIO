"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { useHudState } from "./HudBar";
import WireframeScene from "./WireframeScene";

const headingLine = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { type: "spring" as const, stiffness: 88, damping: 17 },
  },
};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { paused, timecode } = useHudState();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.28]);

  return (
    <motion.section
      id="home"
      ref={heroRef}
      data-scene="00"
      className="film-hero"
      style={{ y, opacity }}
      aria-labelledby="hero-heading"
    >
      <div className="film-hero__inner">
        <div className="scene-label-row film-hero__label-row">
          <p className="scene-label">
            <span>SCENE 00</span>
            <span aria-hidden="true">/</span>
            <span>BEHIND THE BUILD</span>
          </p>
          <p className="scene-label scene-label--aside">
            DESIGN <span aria-hidden="true">/</span> DEVELOPMENT{" "}
            <span aria-hidden="true">/</span> MOTION
          </p>
        </div>

        <div className="film-hero__grid">
          <div className="film-hero__copy">
            <motion.p
              className="film-hero__eyebrow"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              <span aria-hidden="true" />
              BEHIND THE BUILD
            </motion.p>

            <motion.h1
              id="hero-heading"
              className="film-hero__title"
              initial={reducedMotion ? false : "hidden"}
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { delayChildren: 0.24, staggerChildren: 0.16 },
                },
              }}
            >
              <span className="film-hero__mask">
                <motion.span variants={headingLine}>AAYUSH</motion.span>
              </span>
              <span className="film-hero__mask">
                <motion.span variants={headingLine}>
                  <span className="film-hero__long-line">
                    PRATAP <span className="film-hero__accent">SINGH</span>
                  </span>
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              className="film-hero__role mono-label"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.78 }}
            >
              UI/UX + FULL STACK DEVELOPER
            </motion.p>

            <motion.p
              className="film-hero__skills mono-label"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.92 }}
            >
              NEXT.JS <span>·</span> REACT <span>·</span> SPRING BOOT <span>·</span>{" "}
              FIGMA
            </motion.p>

            <motion.p
              className="film-hero__tagline"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 1.08 }}
            >
              I design it. I build it.
            </motion.p>

            <motion.a
              className="film-hero__scroll"
              href="#about"
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 1.24 }}
            >
              <span>SCROLL TO BEGIN</span>
              <ArrowDown size={16} aria-hidden="true" />
            </motion.a>
          </div>

          <motion.div
            className="film-hero__visual"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="film-hero__visual-meta mono-label">
              <span><i aria-hidden="true" /> REC</span>
              <span>TC {timecode}</span>
            </div>
            <div className="film-hero__viewfinder">
              <i className="viewfinder-corner viewfinder-corner--tl" />
              <i className="viewfinder-corner viewfinder-corner--tr" />
              <i className="viewfinder-corner viewfinder-corner--bl" />
              <i className="viewfinder-corner viewfinder-corner--br" />
              <WireframeScene paused={paused || Boolean(reducedMotion)} />
            </div>
            <p className="film-hero__visual-caption mono-label">
              FIG 001 <span aria-hidden="true">/</span> LETTERFORM STUDY
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
