"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

export default function HeroPortrait() {
  return (
    <aside className="hero-profile" aria-label="Developer profile">
      <TiltCard className="hero-profile__image-wrap">
        {(parallax) => (
          <>
            <motion.span
              className="hero-profile__outline"
              aria-hidden="true"
              initial={{ clipPath: "inset(0 100% 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <div className="hero-profile__available">
              <span aria-hidden="true" />
              Available for work
            </div>
            <motion.div
              className="hero-profile__image-reveal"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{
                duration: 0.9,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                className="hero-profile__image-parallax"
                style={{ x: parallax.x, y: parallax.y }}
              >
                <Image
                  src="/images/profile.webp"
                  alt="Portrait of Aayush Pratap Singh"
                  width={640}
                  height={359}
                  quality={90}
                  priority
                  sizes="(max-width: 899px) 88vw, (max-width: 1200px) 40vw, 27rem"
                  className="hero-profile__image"
                />
              </motion.div>
            </motion.div>
            <span className="hero-profile__image-index" aria-hidden="true">
              01 / 01
            </span>
          </>
        )}
      </TiltCard>

      <div className="hero-profile__caption">
        <div className="hero-profile__caption-details">
          <div className="hero-profile__caption-name-row">
            <h2>Aayush Pratap Singh</h2>
            <span className="hero-profile__id">DEV-2026</span>
          </div>
          <p>UI / UX FULL STACK DEVELOPER</p>
        </div>
      </div>
    </aside>
  );
}
