"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";

type Point = { x: number; y: number };

type ProcessPathProps = {
  mapRef: RefObject<HTMLDivElement | null>;
  listRef: RefObject<HTMLOListElement | null>;
  cardRefs: RefObject<Array<HTMLLIElement | null>>;
  progress: MotionValue<number>;
  onActiveStep: (index: number) => void;
  staticMotion: boolean;
};

type PathGeometry = {
  d: string;
  arrows: string[];
  width: number;
  height: number;
};

function roundedPath(points: Point[], radius: number) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1];
    const incomingLength = Math.hypot(current.x - previous.x, current.y - previous.y);
    const outgoingLength = Math.hypot(next.x - current.x, next.y - current.y);
    if (!incomingLength || !outgoingLength) continue;

    const incoming = { x: (current.x - previous.x) / incomingLength, y: (current.y - previous.y) / incomingLength };
    const outgoing = { x: (next.x - current.x) / outgoingLength, y: (next.y - current.y) / outgoingLength };
    const turn = incoming.x * outgoing.y - incoming.y * outgoing.x;

    if (Math.abs(turn) < 0.01) {
      d += ` L ${current.x} ${current.y}`;
      continue;
    }

    const cut = Math.min(radius, incomingLength / 2, outgoingLength / 2);
    const entry = { x: current.x - incoming.x * cut, y: current.y - incoming.y * cut };
    const exit = { x: current.x + outgoing.x * cut, y: current.y + outgoing.y * cut };
    d += ` L ${entry.x} ${entry.y} Q ${current.x} ${current.y} ${exit.x} ${exit.y}`;
  }

  const last = points[points.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

function arrowPaths(points: Point[]) {
  return points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    const dx = next.x - point.x;
    const dy = next.y - point.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const px = -uy;
    const py = ux;
    const mx = (point.x + next.x) / 2;
    const my = (point.y + next.y) / 2;
    const tipX = mx + ux * 4;
    const tipY = my + uy * 4;
    const baseX = mx - ux * 4;
    const baseY = my - uy * 4;
    return `M ${baseX + px * 4} ${baseY + py * 4} L ${tipX} ${tipY} L ${baseX - px * 4} ${baseY - py * 4}`;
  });
}

function closestProgress(path: SVGPathElement, target: Point, length: number) {
  const samples = Math.max(180, Math.ceil(length / 5));
  let closestDistance = 0;
  let closestError = Number.POSITIVE_INFINITY;
  for (let sample = 0; sample <= samples; sample += 1) {
    const distance = (length * sample) / samples;
    const point = path.getPointAtLength(distance);
    const error = Math.hypot(point.x - target.x, point.y - target.y);
    if (error < closestError) {
      closestError = error;
      closestDistance = distance;
    }
  }
  return closestDistance / length;
}

function ProcessArrow({
  d,
  at,
  progress,
  staticMotion,
}: {
  d: string;
  at: number;
  progress: MotionValue<number>;
  staticMotion: boolean;
}) {
  const opacity = useTransform(
    progress,
    [Math.max(0, at - 0.075), at, Math.min(1, at + 0.075)],
    [0.18, 1, 0.18],
  );

  return (
    <motion.path
      className="process-path__arrows"
      d={d}
      style={{ opacity: staticMotion ? 0.55 : opacity }}
    />
  );
}

export default function ProcessPath({
  mapRef,
  listRef,
  cardRefs,
  progress,
  onActiveStep,
  staticMotion,
}: ProcessPathProps) {
  const basePathRef = useRef<SVGPathElement>(null);
  const [geometry, setGeometry] = useState<PathGeometry>({ d: "", arrows: [], width: 1, height: 1 });
  const [anchorProgress, setAnchorProgress] = useState<number[]>([]);
  const [arrowProgress, setArrowProgress] = useState<number[]>([]);
  const [pathLength, setPathLength] = useState(0);
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const dashOffset = useMotionValue(0);

  const measure = useCallback(() => {
    const map = mapRef.current;
    const list = listRef.current;
    if (!map || !list) return;

    const width = map.clientWidth;
    const height = map.clientHeight;
    if (!width || !height) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const points = cardRefs.current.flatMap((card) => {
      if (!card) return [];
      return [{
        x: isMobile ? 12 : list.offsetLeft + card.offsetLeft + card.offsetWidth / 2,
        y: list.offsetTop + card.offsetTop + card.offsetHeight / 2,
      }];
    });

    if (points.length !== 6) return;
    setGeometry({ d: roundedPath(points, isMobile ? 0 : 28), arrows: arrowPaths(points), width, height });
  }, [cardRefs, listRef, mapRef]);

  useLayoutEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const observer = new ResizeObserver(measure);
    observer.observe(map);
    cardRefs.current.forEach((card) => card && observer.observe(card));
    measure();
    return () => observer.disconnect();
  }, [cardRefs, mapRef, measure]);

  useLayoutEffect(() => {
    const path = basePathRef.current;
    if (!path || !geometry.d) return;
    const length = path.getTotalLength();
    const map = mapRef.current;
    const list = listRef.current;
    if (!map || !list || !length) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const centers = cardRefs.current.flatMap((card) => {
      if (!card) return [];
      return [{
        x: isMobile ? 12 : list.offsetLeft + card.offsetLeft + card.offsetWidth / 2,
        y: list.offsetTop + card.offsetTop + card.offsetHeight / 2,
      }];
    });
    const anchors = centers.map((center) => closestProgress(path, center, length));
    const arrowAnchors = centers.slice(0, -1).map((center, index) => closestProgress(path, {
      x: (center.x + centers[index + 1].x) / 2,
      y: (center.y + centers[index + 1].y) / 2,
    }, length));

    setPathLength(length);
    setAnchorProgress(anchors);
    setArrowProgress(arrowAnchors);
  }, [cardRefs, geometry.d, listRef, mapRef]);

  const followProgress = useCallback((value: number) => {
    const path = basePathRef.current;
    if (!path || !pathLength) return;
    const clampedProgress = Math.max(0, Math.min(1, value));
    const point = path.getPointAtLength(clampedProgress * pathLength);
    dotX.set(point.x);
    dotY.set(point.y);
    dashOffset.set(pathLength * (1 - clampedProgress));

    let activeIndex = 0;
    anchorProgress.forEach((anchor, index) => {
      if (value >= anchor) activeIndex = index;
    });
    onActiveStep(activeIndex);
  }, [anchorProgress, dashOffset, dotX, dotY, onActiveStep, pathLength]);

  useMotionValueEvent(progress, "change", followProgress);
  useLayoutEffect(() => followProgress(progress.get()), [followProgress, progress]);

  return (
    <svg
      className="process-path"
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="process-path-dot-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {geometry.d && (
        <>
          <path ref={basePathRef} className="process-path__track" d={geometry.d} />
          <motion.path
            className="process-path__drawn"
            d={geometry.d}
            strokeDasharray={pathLength || 1}
            style={{ strokeDashoffset: dashOffset }}
          />
          {geometry.arrows.map((arrow, index) => (
            <ProcessArrow
              key={index}
              d={arrow}
              at={arrowProgress[index] ?? (index + 0.5) / (geometry.arrows.length + 1)}
              progress={progress}
              staticMotion={staticMotion}
            />
          ))}
          <motion.g className={`process-path__dot${staticMotion ? " process-path__dot--hidden" : ""}`} style={{ x: dotX, y: dotY }}>
            <circle r="10" className="process-path__dot-halo" filter="url(#process-path-dot-glow)" />
            <circle r="3.5" className="process-path__dot-core" />
          </motion.g>
        </>
      )}
    </svg>
  );
}
