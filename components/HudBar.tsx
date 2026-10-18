"use client";

import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { Pause, Play } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import TimelineBar from "./TimelineBar";

type HudState = {
  paused: boolean;
  timecode: string;
};

const HudContext = createContext<HudState | null>(null);

export function useHudState() {
  const state = useContext(HudContext);
  if (!state) throw new Error("useHudState must be used inside HudBar.");
  return state;
}

function formatTimecode(milliseconds: number) {
  const frames = Math.floor(milliseconds / (1000 / 24));
  const hours = Math.floor(frames / 86400);
  const minutes = Math.floor((frames % 86400) / 1440);
  const seconds = Math.floor((frames % 1440) / 24);
  const frame = frames % 24;
  return [hours, minutes, seconds, frame]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

export default function HudBar({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [sceneNumber, setSceneNumber] = useState("00");
  const elapsed = useRef(0);
  const lastTick = useRef(0);
  const lenis = useRef<Lenis | null>(null);
  const pausedAnimations = useRef<Animation[]>([]);
  const hudState = useMemo(() => ({ paused, timecode }), [paused, timecode]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;

    lenis.current = new Lenis({ autoRaf: true, smoothWheel: true });
    return () => {
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    if (paused) lenis.current?.stop();
    else lenis.current?.start();
  }, [paused]);

  useEffect(() => {
    if (paused) {
      pausedAnimations.current = document
        .getAnimations()
        .filter((animation) => animation.playState === "running");
      pausedAnimations.current.forEach((animation) => animation.pause());
      return;
    }

    pausedAnimations.current.forEach((animation) => {
      if (animation.playState === "paused") animation.play();
    });
    pausedAnimations.current = [];
  }, [paused]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (!lastTick.current) lastTick.current = now;
      if (!paused) elapsed.current += now - lastTick.current;
      lastTick.current = now;
      setTimecode(formatTimecode(elapsed.current));
    }, 100);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    let frame = 0;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[id]"),
    );
    const updateScene = () => {
      frame = 0;
      const threshold = window.scrollY + window.innerHeight * 0.42;
      let activeIndex = 0;
      sections.forEach((section, index) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= threshold) activeIndex = index;
      });
      setSceneNumber(activeIndex.toString().padStart(2, "0"));
    };
    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScene);
    };

    updateScene();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <HudContext.Provider value={hudState}>
      <MotionConfig reducedMotion="user">
        <div className="film-experience" data-motion-paused={paused || undefined}>
          {children}
          <div className="hud-bar" aria-label="Portfolio playback controls">
            <span className="hud-bar__scene">SCENE {sceneNumber}</span>
            <span className="hud-bar__timecode" aria-label={`Timecode ${timecode}`}>
              TC {timecode}
            </span>
            <button
              type="button"
              className="hud-bar__toggle"
              aria-label={paused ? "Play animations" : "Pause animations"}
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              <span>{paused ? "PLAY" : "PAUSE"}</span>
            </button>
          </div>
          <TimelineBar />
        </div>
      </MotionConfig>
    </HudContext.Provider>
  );
}
