"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef, type PointerEvent, type Ref } from "react";

export type ProcessStep = {
  number: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

type ProcessCardProps = {
  step: ProcessStep;
  index: number;
  active: boolean;
  reached: boolean;
  completed: boolean;
  staticMotion: boolean;
  cardRef: Ref<HTMLLIElement>;
};

export default function ProcessCard({
  step,
  index,
  active,
  reached,
  completed,
  staticMotion,
  cardRef,
}: ProcessCardProps) {
  const Icon = step.icon;
  const cardState = active ? "active" : reached ? "reached" : "waiting";
  const boundsRef = useRef<DOMRect | null>(null);

  const cacheBounds = (event: PointerEvent<HTMLElement>) => {
    boundsRef.current = event.currentTarget.getBoundingClientRect();
  };

  const followPointer = (event: PointerEvent<HTMLElement>) => {
    const bounds = boundsRef.current;
    if (!bounds) return;
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  };

  const resetPointer = (event: PointerEvent<HTMLElement>) => {
    boundsRef.current = null;
    event.currentTarget.style.setProperty("--spot-x", "50%");
    event.currentTarget.style.setProperty("--spot-y", "50%");
  };

  return (
    <motion.li
      ref={cardRef}
      className="process-list__item"
      tabIndex={0}
      aria-current={active ? "step" : undefined}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
        still: { opacity: 1, y: 0, transition: { duration: 0 } },
      }}
      transition={{ duration: staticMotion ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.article
        className={`process-card process-card--${cardState}`}
        animate={{ opacity: reached ? 1 : 0.55, scale: active ? 1.02 : 1 }}
        whileHover={staticMotion ? undefined : { y: -4 }}
        transition={{ duration: staticMotion ? 0 : 0.28, ease: [0.2, 0.7, 0.2, 1] }}
        onPointerEnter={cacheBounds}
        onPointerMove={followPointer}
        onPointerLeave={resetPointer}
      >
        <span className="process-card__spotlight" aria-hidden="true" />
        <span className="process-card__noise" aria-hidden="true" />
        <span className="process-card__corner process-card__corner--tl" aria-hidden="true" />
        <span className="process-card__corner process-card__corner--tr" aria-hidden="true" />
        <span className="process-card__corner process-card__corner--bl" aria-hidden="true" />
        <span className="process-card__corner process-card__corner--br" aria-hidden="true" />

        <div className="process-card__top">
          <div className="process-card__step">
            <span className="process-card__number">{step.number}</span>
            <span className="process-card__total">/ 06</span>
            {completed && <><Check className="process-card__complete" size={15} aria-hidden="true" /><span className="sr-only">Completed</span></>}
          </div>
          <span className="process-card__icon-tile">
            <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
          </span>
        </div>

        <div className="process-card__copy">
          <h3>{step.title}</h3>
          <p>{step.subtitle}</p>
        </div>
        <motion.span
          className="process-card__progress"
          aria-hidden="true"
          animate={{ scaleX: active || completed ? 1 : 0 }}
          transition={{ duration: staticMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="sr-only">Step {index + 1} of 6</span>
      </motion.article>
    </motion.li>
  );
}
