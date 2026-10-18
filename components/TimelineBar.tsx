"use client";

import { motion, useScroll } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

type SceneMarker = {
  id: string;
  number: string;
  position: number;
};

export default function TimelineBar() {
  const { scrollYProgress } = useScroll();
  const [markers, setMarkers] = useState<SceneMarker[]>([]);

  const measureMarkers = useCallback(() => {
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    );
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[id]"),
    );
    setMarkers(
      sections.map((section, index) => ({
        id: section.id,
        number: index.toString().padStart(2, "0"),
        position: Math.min(
          100,
          Math.max(
            0,
            ((section.getBoundingClientRect().top + window.scrollY) / maxScroll) *
              100,
          ),
        ),
      })),
    );
  }, []);

  useEffect(() => {
    const initialFrame = window.requestAnimationFrame(measureMarkers);
    const observer = new ResizeObserver(measureMarkers);
    observer.observe(document.body);
    window.addEventListener("resize", measureMarkers);
    window.addEventListener("load", measureMarkers);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      observer.disconnect();
      window.removeEventListener("resize", measureMarkers);
      window.removeEventListener("load", measureMarkers);
    };
  }, [measureMarkers]);

  return (
    <nav className="timeline-bar" aria-label="Scene timeline">
      <div
        className="timeline-bar__track"
      >
        <motion.span
          className="timeline-bar__progress"
          style={{ scaleX: scrollYProgress }}
        />
        {markers.map((marker) => (
          <a
            key={marker.id}
            className="timeline-bar__tick"
            href={`#${marker.id}`}
            style={{ left: `${marker.position}%` }}
            aria-label={`Go to scene ${marker.number}`}
          />
        ))}
      </div>
    </nav>
  );
}
