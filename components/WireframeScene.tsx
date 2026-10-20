"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type WireframeSceneProps = {
  paused: boolean;
};

export default function WireframeScene({ paused }: WireframeSceneProps) {
  const [angle, setAngle] = useState(0);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const angleRef = useRef(0);
  const horizontalOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const horizontalVelocityRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const dragStartRef = useRef({ x: 0, angle: 0, offset: 0, time: 0 });

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const setRotation = (nextAngle: number) => {
    angleRef.current = nextAngle;
    setAngle(nextAngle);
  };

  const setOffset = (nextOffset: number) => {
    horizontalOffsetRef.current = nextOffset;
    setHorizontalOffset(nextOffset);
  };

  const startSwing = () => {
    if (paused) {
      setRotation(0);
      setOffset(0);
      velocityRef.current = 0;
      horizontalVelocityRef.current = 0;
      return;
    }

    const tick = () => {
      const nextVelocity = (velocityRef.current - angleRef.current * 0.075) * 0.94;
      const nextAngle = angleRef.current + nextVelocity;
      const nextHorizontalVelocity = (horizontalVelocityRef.current - horizontalOffsetRef.current * 0.075) * 0.94;
      const nextHorizontalOffset = horizontalOffsetRef.current + nextHorizontalVelocity;
      velocityRef.current = nextVelocity;
      horizontalVelocityRef.current = nextHorizontalVelocity;

      if (
        Math.abs(nextAngle) < 0.12 &&
        Math.abs(nextVelocity) < 0.12 &&
        Math.abs(nextHorizontalOffset) < 0.2 &&
        Math.abs(nextHorizontalVelocity) < 0.2
      ) {
        velocityRef.current = 0;
        horizontalVelocityRef.current = 0;
        frameRef.current = null;
        setRotation(0);
        setOffset(0);
        return;
      }

      setRotation(nextAngle);
      setOffset(nextHorizontalOffset);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    if (
      Math.abs(angleRef.current) < 0.2 &&
      Math.abs(velocityRef.current) < 0.2 &&
      Math.abs(horizontalOffsetRef.current) < 0.2 &&
      Math.abs(horizontalVelocityRef.current) < 0.2
    ) {
      setRotation(0);
      setOffset(0);
      return;
    }

    frameRef.current = window.requestAnimationFrame(tick);
  };

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    velocityRef.current = 0;
    horizontalVelocityRef.current = 0;
    dragStartRef.current = {
      x: event.clientX,
      angle: angleRef.current,
      offset: horizontalOffsetRef.current,
      time: performance.now(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const now = performance.now();
    const scale = Math.min(bounds.width / 360, bounds.height / 620);
    const anchorX = bounds.left + bounds.width / 2;
    const cardMargin = 110 * scale;
    const minOffset = (cardMargin - anchorX) / scale;
    const maxOffset = (window.innerWidth - cardMargin - anchorX) / scale;
    const nextOffset = Math.max(
      minOffset,
      Math.min(maxOffset, dragStartRef.current.offset + (event.clientX - dragStartRef.current.x) / scale),
    );
    const nextAngle = Math.max(
      -28,
      Math.min(28, dragStartRef.current.angle - ((event.clientX - dragStartRef.current.x) / bounds.width) * 52),
    );
    const elapsed = Math.max(1, now - dragStartRef.current.time);
    velocityRef.current = ((nextAngle - angleRef.current) / elapsed) * 16;
    horizontalVelocityRef.current = ((nextOffset - horizontalOffsetRef.current) / elapsed) * 16;
    dragStartRef.current.time = now;
    setOffset(nextOffset);
    setRotation(nextAngle);
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    startSwing();
  };

  return (
    <div className="film-scene" aria-hidden="true" data-paused={paused}>
      <div className="film-scene__glow" />
      <svg
        className={`film-monogram film-id-card${dragging ? " is-dragging" : ""}${paused ? " is-paused" : ""}`}
        viewBox="0 0 360 620"
        role="presentation"
        focusable="false"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <linearGradient id="card-face" x1="96" y1="120" x2="272" y2="397" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1c1d1c" />
            <stop offset=".58" stopColor="#141615" />
            <stop offset="1" stopColor="#101211" />
          </linearGradient>
          <linearGradient id="card-edge" x1="91" y1="116" x2="276" y2="397" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f4f5f0" />
            <stop offset=".3" stopColor="#222723" />
            <stop offset=".7" stopColor="#080a09" />
            <stop offset="1" stopColor="#b8f45c" />
          </linearGradient>
          <clipPath id="id-photo-clip">
            <circle cx="180" cy="184" r="35" />
          </clipPath>
          <filter id="portrait-glow" x="125" y="129" width="110" height="110" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="id-card-shadow" x="25" y="20" width="310" height="430" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
            <feOffset dy="12" />
            <feComponentTransfer>
              <feFuncA type="linear" slope=".55" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="film-id-card__swing" transform={`translate(${horizontalOffset} 0) rotate(${angle} 180 0)`}>
        <g className="film-id-card__lanyard">
          <path d="M137-10C138 35 145 78 164 105c8 12 16 23 16 40M224-10c-1 45-8 88-27 115-8 12-17 23-17 40M180 146c0 31-3 65 0 106" stroke="#080a09" strokeWidth="13" strokeLinecap="round" />
          <path d="M137-10C138 35 145 78 164 105c8 12 16 23 16 40M224-10c-1 45-8 88-27 115-8 12-17 23-17 40M180 146c0 31-3 65 0 106" stroke="#293329" strokeWidth="6" strokeLinecap="round" />
          <path d="M137-10C138 35 145 78 164 105c8 12 16 23 16 40M224-10c-1 45-8 88-27 115-8 12-17 23-17 40M180 146c0 31-3 65 0 106" fill="none" stroke="#a8e85a" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
          <path d="M166 106c-2-12 6-22 15-22s17 10 15 22l-3 19h-24l-3-19Z" fill="#0a0c0b" stroke="#727973" strokeWidth="2" />
          <path d="M174 105v-7a7 7 0 0 1 14 0v7" stroke="#c6cbc6" strokeWidth="4" />
          <path d="M180 124v128" stroke="#080a09" strokeWidth="13" strokeLinecap="round" />
          <path d="M180 124v128" stroke="#293329" strokeWidth="6" strokeLinecap="round" />
          <path d="M180 124v128" stroke="#a8e85a" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
          <rect x="165" y="236" width="30" height="29" rx="5" fill="#090b0a" stroke="#515852" strokeWidth="2" />
          <rect x="171" y="241" width="18" height="8" rx="2" fill="#242925" stroke="#818881" strokeWidth="1" />
          <path d="M175 255h10" stroke="#a8e85a" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g className="film-id-card__body" transform="translate(0 120)">
          <g transform="translate(180 120) scale(1.3) translate(-180 -120)">
        <g filter="url(#id-card-shadow)">
          <rect x="94" y="120" width="172" height="270" rx="16" fill="#090b0a" stroke="url(#card-edge)" strokeWidth="3" />
          <rect x="100" y="126" width="160" height="258" rx="11" fill="url(#card-face)" />
          <circle cx="180" cy="184" r="41" fill="#effff2" opacity=".46" filter="url(#portrait-glow)" />
          <circle cx="180" cy="184" r="38" fill="#f5f6f4" />
          <image
            href="/images/profile-circle.jpeg"
            x="145"
            y="149"
            width="70"
            height="70"
            clipPath="url(#id-photo-clip)"
            preserveAspectRatio="xMidYMax slice"
          />
          <circle cx="180" cy="184" r="35" fill="none" stroke="#fff" strokeWidth="1.2" />
          <text x="180" y="245" textAnchor="middle" fill="#f0f1f0" fontSize="15" fontWeight="500" fontFamily="sans-serif" letterSpacing="-.25">Aayush Singh</text>
          <text x="180" y="265" textAnchor="middle" fill="#a5a9b1" fontSize="7.6" fontFamily="sans-serif" letterSpacing=".12">UI/UX FRONTEND DEVELOPER</text>
          <path d="M151 287h58" stroke="#737980" strokeWidth="1" />
          <text x="180" y="316" textAnchor="middle" fill="#a5a9b1" fontSize="7" fontFamily="monospace" letterSpacing="1.8">DEVELOPER ID</text>
          <text x="180" y="338" textAnchor="middle" fill="#737b87" fontSize="9" fontFamily="sans-serif">DEV-2026</text>
        </g>
          </g>
        </g>
        </g>
      </svg>
    </div>
  );
}
