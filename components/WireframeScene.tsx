"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

const WireframeCanvas = dynamic(() => import("./WireframeCanvas"), {
  ssr: false,
  loading: () => null,
});

type PointerPosition = {
  x: number;
  y: number;
};

type WireframeSceneProps = {
  paused: boolean;
};

const orbParticles = Array.from({ length: 112 }, (_, index) => {
  const angle = index * 2.399963;
  const distance = 34 + Math.sqrt((index + 0.5) / 112) * 102;
  return {
    x: (200 + Math.cos(angle) * distance).toFixed(3),
    y: (200 + Math.sin(angle) * distance).toFixed(3),
    radius: (0.55 + ((index * 17) % 11) / 10).toFixed(2),
    opacity: (0.25 + ((index * 13) % 7) / 10).toFixed(2),
  };
});

function StaticHologram() {
  return (
    <svg
      className="film-monogram"
      viewBox="0 0 400 400"
      role="presentation"
      focusable="false"
    >
      <defs>
        <radialGradient id="orb-core">
          <stop offset="0" stopColor="#ffbb59" stopOpacity=".36" />
          <stop offset=".54" stopColor="#ff792b" stopOpacity=".18" />
          <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
        </radialGradient>
        <filter id="orb-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="200" cy="200" r="152" fill="url(#orb-core)" />
      <g
        fill="none"
        stroke="#ff9b36"
        strokeOpacity=".68"
        strokeWidth="1"
        filter="url(#orb-glow)"
      >
        <circle cx="200" cy="200" r="138" strokeDasharray="4 3 22 5 12 4" />
        <circle cx="200" cy="200" r="127" strokeDasharray="42 4 18 3 8 5" />
        <circle cx="200" cy="200" r="112" strokeDasharray="3 3 30 4 13 5" />
        <circle cx="200" cy="200" r="95" strokeDasharray="19 4 8 3 34 4" />
        <ellipse cx="200" cy="200" rx="138" ry="70" />
        <ellipse cx="200" cy="200" rx="138" ry="70" transform="rotate(35 200 200)" />
        <ellipse cx="200" cy="200" rx="138" ry="70" transform="rotate(-35 200 200)" />
        <ellipse cx="200" cy="200" rx="138" ry="42" transform="rotate(70 200 200)" />
        <ellipse cx="200" cy="200" rx="138" ry="42" transform="rotate(-70 200 200)" />
        <ellipse cx="200" cy="200" rx="121" ry="88" transform="rotate(19 200 200)" strokeDasharray="4 2 1 3" strokeOpacity=".58" />
        <ellipse cx="200" cy="200" rx="126" ry="97" transform="rotate(-23 200 200)" strokeDasharray="2 3 12 2" strokeOpacity=".52" />
        <ellipse cx="200" cy="200" rx="106" ry="123" transform="rotate(53 200 200)" strokeDasharray="16 3 3 2" strokeOpacity=".48" />
        <circle cx="200" cy="200" r="145" strokeDasharray="1 4 2 3 8 2" strokeOpacity=".6" />
        <circle cx="200" cy="200" r="82" strokeDasharray="3 6 1 2 14 3" strokeOpacity=".48" />
        <path d="M62 200h276M76 156l248 88M76 244l248-88M104 111l192 178M104 289l192-178" strokeOpacity=".23" />
        <path d="M82 179h39m18 0h27m107 0h31m-222 41h54m18 0h32m78 0h45M145 92v34m0 28v16m110 75v44m0-68v-31m-95 86v34m0-62v-19m-44-135h28m79 0h21m-114 220h38m73 0h27" strokeOpacity=".68" />
        <circle cx="200" cy="200" r="40" strokeOpacity=".7" />
        <circle cx="200" cy="200" r="24" stroke="#ffd07a" strokeOpacity=".8" />
      </g>
      <g fill="#ffad45" filter="url(#orb-glow)">
        {orbParticles.map((particle, index) => (
          <circle
            key={index}
            cx={particle.x}
            cy={particle.y}
            r={particle.radius}
            opacity={particle.opacity}
          />
        ))}
        <circle cx="200" cy="62" r="2.5" />
        <circle cx="296" cy="101" r="2" />
        <circle cx="338" cy="200" r="2.5" />
        <circle cx="289" cy="296" r="2" />
        <circle cx="200" cy="338" r="2.5" />
        <circle cx="105" cy="292" r="2" />
        <circle cx="62" cy="200" r="2.5" />
        <circle cx="104" cy="105" r="2" />
        <circle cx="200" cy="160" r="3" />
        <circle cx="174" cy="206" r="2" />
        <circle cx="226" cy="193" r="2" />
        <circle cx="178" cy="235" r="1.5" />
        <circle cx="237" cy="229" r="1.5" />
      </g>
    </svg>
  );
}

export default function WireframeScene({ paused }: WireframeSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const pendingPointer = useRef<PointerPosition>({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  const [staticMode, setStaticMode] = useState(true);
  const [intersecting, setIntersecting] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(false);
  const [pointer, setPointer] = useState<PointerPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const viewport = window.matchMedia(
      "(max-width: 767px), (hover: none), (pointer: coarse)",
    );
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateMode = () =>
      setStaticMode(viewport.matches || motionPreference.matches);

    updateMode();
    viewport.addEventListener("change", updateMode);
    motionPreference.addEventListener("change", updateMode);
    return () => {
      viewport.removeEventListener("change", updateMode);
      motionPreference.removeEventListener("change", updateMode);
    };
  }, []);

  useEffect(() => {
    const target = sceneRef.current;
    if (!target || staticMode || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) setHasEnteredView(true);
      },
      { threshold: 0.05 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [reducedMotion, staticMode]);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(
    () => () => {
      if (pointerFrame.current) {
        window.cancelAnimationFrame(pointerFrame.current);
      }
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      pendingPointer.current = {
        x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        y: 1 - ((event.clientY - bounds.top) / bounds.height) * 2,
      };
      if (pointerFrame.current) return;
      pointerFrame.current = window.requestAnimationFrame(() => {
        setPointer(pendingPointer.current);
        pointerFrame.current = 0;
      });
    },
    [],
  );

  const active =
    !staticMode &&
    !reducedMotion &&
    !paused &&
    intersecting &&
    documentVisible;

  return (
    <div
      ref={sceneRef}
      className={`film-scene${staticMode || reducedMotion ? " is-static" : ""}${active ? " is-active" : ""}`}
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <div className="film-scene__glow" />
      {staticMode || reducedMotion ? (
        <StaticHologram />
      ) : (
        <>
          <StaticHologram />
          {hasEnteredView && (
            <div className="film-scene__canvas">
              <WireframeCanvas pointer={pointer} active={active} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
