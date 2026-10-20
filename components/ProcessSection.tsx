"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { Code2, Frame, PencilRuler, Rocket, ScanEye, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ProcessCard, { type ProcessStep } from "./ProcessCard";
import ProcessPath from "./ProcessPath";
import { useHudState } from "./HudBar";

const steps: ProcessStep[] = [
  { number: "01", title: "Sketch the idea", subtitle: "Explore the problem", icon: PencilRuler },
  { number: "02", title: "Shape the experience", subtitle: "Wireframe and design", icon: Frame },
  { number: "03", title: "Build the product", subtitle: "Turn design into code", icon: Code2 },
  { number: "04", title: "Test real screens", subtitle: "Check every breakpoint", icon: ScanEye },
  { number: "05", title: "Refine the details", subtitle: "Polish the interactions", icon: SlidersHorizontal },
  { number: "06", title: "Ship with care", subtitle: "Make it ready to use", icon: Rocket },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
  still: {},
};

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const { paused } = useHudState();
  const staticMotion = paused || reducedMotion === true;
  const pathProgress = useMotionValue(0);

  useEffect(() => {
    if (staticMotion) {
      pathProgress.set(1);
      return;
    }

    pathProgress.set(0);
    const loop = animate(pathProgress, 1, {
      duration: 9,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0.35,
    });

    return () => loop.stop();
  }, [pathProgress, staticMotion]);

  const handleActiveStep = useCallback((index: number) => {
    setActiveIndex((current) => current === index ? current : index);
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="editorial-section editorial-section--spacious process-section"
      aria-labelledby="process-title"
    >
      <div className="editorial-container">
        <header className="process-section__heading" data-reveal>
          <div>
            <p className="process-section__eyebrow"><span /> THE PROCESS / 03</p>
            <h2 id="process-title">Every idea.<br /><span>A considered path.</span></h2>
          </div>
          <p>From a rough sketch to something real. I keep the process clear, move with purpose, and make room to get the details right.</p>
        </header>

        <div ref={mapRef} className="process-map">
          <ProcessPath
            mapRef={mapRef}
            listRef={listRef}
            cardRefs={cardRefs}
            progress={pathProgress}
            onActiveStep={handleActiveStep}
            staticMotion={staticMotion}
          />
          <motion.ol
            ref={listRef}
            className="process-list"
            aria-label="Project process, in order"
            variants={listVariants}
            initial={staticMotion ? false : "hidden"}
            whileInView={staticMotion ? undefined : "visible"}
            animate={staticMotion ? "still" : undefined}
            viewport={{ once: true, amount: 0.12 }}
          >
            {steps.map((step, index) => (
              <ProcessCard
                key={step.number}
                cardRef={(element) => { cardRefs.current[index] = element; }}
                step={step}
                index={index}
                active={staticMotion ? index === steps.length - 1 : activeIndex === index}
                reached={staticMotion || index <= activeIndex}
                completed={staticMotion ? index < steps.length - 1 : index < activeIndex}
                staticMotion={staticMotion}
              />
            ))}
          </motion.ol>
        </div>
        <div className="process-section__footnote">
          <span>IDEA <span aria-hidden="true">→</span> REALITY</span>
          <Link href="/#contact" className="process-section__link motion-control">HAVE A PROJECT IN MIND? <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
