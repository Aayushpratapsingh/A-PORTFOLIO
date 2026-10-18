"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import MagneticButton from "./MagneticButton";
import HeroPortrait from "./HeroPortrait";
import Marquee from "./Marquee";
import SpotlightBackground from "./SpotlightBackground";

const roles = ["UI/UX Designer", "Full Stack Developer", "Video Editor"];

const wordVariants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { type: "spring" as const, stiffness: 110, damping: 15 },
  },
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [nameRevealed, setNameRevealed] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 0.8], [0, -24]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.75]);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roles.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id="home"
        ref={sectionRef}
        className="editorial-section hero-section"
      >
      <SpotlightBackground containerRef={sectionRef} />
      <motion.div
        className="editorial-container hero-layout"
        style={{
          y: reducedMotion ? 0 : contentY,
          opacity: reducedMotion ? 1 : contentOpacity,
        }}
      >
        <div className="hero-copy">
          <motion.p
            className="hero-role"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span aria-hidden="true" />
            UI / UX FULL STACK DEVELOPER
          </motion.p>

          <motion.h1
            className="hero-title"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.16, delayChildren: 0.18 },
              },
            }}
            initial="hidden"
            animate="visible"
            onAnimationComplete={() => setNameRevealed(true)}
            aria-label="Aayush Pratap Singh"
          >
            <span className="hero-title__line hero-title__line--first">
              <span className="hero-title__word-mask">
                <motion.span variants={wordVariants}>Aayush</motion.span>
              </span>
            </span>
            <span className="hero-title__line hero-title__line--second">
              <span className="hero-title__word-mask">
                <motion.span variants={wordVariants}>Pratap</motion.span>
              </span>{" "}
              <span className="hero-title__word-mask hero-title__word-mask--accent">
                <motion.span className="hero-title__accent" variants={wordVariants}>
                  Singh
                </motion.span>
                <svg
                  className="hero-title__underline"
                  viewBox="0 0 220 18"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M3 13C52 3 150 3 216 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={nameRevealed ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
                  />
                </svg>
              </span>
            </span>
          </motion.h1>

          <motion.p
            className="hero-intro"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82, duration: 0.55 }}
          >
            I build <span>interactive websites</span> and <span>modern web apps</span> using cutting-edge technologies.
          </motion.p>

          <motion.p
            className="hero-rotating-role"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.98, duration: 0.45 }}
          >
            <span>Currently crafting as</span>
            <span className="hero-rotating-role__value" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={roles[roleIndex]}
                  className="hero-rotating-role__text"
                  aria-label={roles[roleIndex]}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -8 }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.035 },
                    },
                  }}
                >
                  {Array.from(roles[roleIndex], (character, index) => (
                    <motion.span
                      key={`${character}-${index}`}
                      aria-hidden="true"
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.2 },
                        },
                      }}
                    >
                      {character === " " ? "\u00a0" : character}
                    </motion.span>
                  ))}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.18, duration: 0.5 }}
          >
            <MagneticButton className="hero-cta hero-cta--primary motion-control" href="#contact">
              Let&apos;s work together
              <span aria-hidden="true">↗</span>
            </MagneticButton>
            <MagneticButton className="hero-cta hero-cta--secondary motion-control" href="#work">
              Explore selected work
              <span aria-hidden="true">↓</span>
            </MagneticButton>
          </motion.div>

          <motion.a
            className="hero-scroll-indicator"
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.5 }}
          >
            <span>Scroll to explore</span>
            <motion.span
              className="hero-scroll-indicator__line"
              aria-hidden="true"
              animate={{ scaleY: [0.45, 1, 0.45] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.a>

          <motion.nav
            className="hero-socials"
            aria-label="Social links"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { delayChildren: 1.32, staggerChildren: 0.08 },
              },
            }}
          >
            {[
              { label: "GitHub", href: "https://github.com/Aayushpratapsingh", icon: <Github size={18} aria-hidden="true" /> },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/aayush-singh-16287b321/", icon: <Linkedin size={18} aria-hidden="true" /> },
              { label: "Email", href: "mailto:aayushpratapsingh098@gmail.com", icon: <Mail size={18} aria-hidden="true" /> },
              { label: "Instagram", href: "https://www.instagram.com", icon: <Instagram size={18} aria-hidden="true" /> },
            ].map((link) => (
              <motion.div
                key={link.label}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 180, damping: 18 },
                  },
                }}
              >
                <MagneticButton
                  className="motion-control"
                  href={link.href}
                  aria-label={link.label}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.icon}
                </MagneticButton>
              </motion.div>
            ))}
          </motion.nav>
        </div>

        <HeroPortrait />
      </motion.div>
      <Marquee />
      </motion.section>
    </MotionConfig>
  );
}
