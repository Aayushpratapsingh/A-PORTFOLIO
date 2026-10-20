"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";

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
  arrows: { d: string; x: number; y: number }[];
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
    return {
      d: `M ${baseX + px * 4} ${baseY + py * 4} L ${tipX} ${tipY} L ${baseX - px * 4} ${baseY - py * 4}`,
      x: ux * 12,
      y: uy * 12,
    };
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

function getCardCenters(map: HTMLDivElement, list: HTMLOListElement, isMobile: boolean) {
  const mapBounds = map.getBoundingClientRect();
  return Array.from(list.querySelectorAll<HTMLLIElement>(".process-list__item"), (card) => {
    const bounds = card.getBoundingClientRect();
    return {
      x: isMobile ? 12 : bounds.left - mapBounds.left + bounds.width / 2,
      y: bounds.top - mapBounds.top + bounds.height / 2,
    };
  });
}

function ProcessArrow({
  d,
  x,
  y,
  index,
  staticMotion,
}: {
  d: string;
  x: number;
  y: number;
  index: number;
  staticMotion: boolean;
}) {
  const style = staticMotion ? undefined : {
    animationDelay: `${index * 1.8}s`,
    "--flow-half-x": `${x * 0.35}px`,
    "--flow-half-y": `${y * 0.35}px`,
    "--flow-x": `${x}px`,
    "--flow-y": `${y}px`,
  } as CSSProperties;

  return (
    <path
      className={`process-path__arrows${staticMotion ? "" : " process-path__arrow-flow"}`}
      d={d}
      style={style}
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
  const [pathLength, setPathLength] = useState(0);
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const dotAngle = useMotionValue(0);
  const dashOffset = useMotionValue(0);

  const measure = useCallback(() => {
    const map = mapRef.current;
    const list = listRef.current;
    if (!map || !list) return;

    const width = map.clientWidth;
    const height = map.clientHeight;
    if (!width || !height) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const points = getCardCenters(map, list, isMobile);

    if (points.length !== 6) return;
    setGeometry({ d: roundedPath(points, isMobile ? 0 : 28), arrows: arrowPaths(points), width, height });
  }, [listRef, mapRef]);

  useEffect(() => {
    const map = mapRef.current;
    const list = listRef.current;
    if (!map || !list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(map);
    observer.observe(list);
    cardRefs.current.forEach((card) => card && observer.observe(card));
    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [cardRefs, listRef, mapRef, measure]);

  useLayoutEffect(() => {
    const path = basePathRef.current;
    if (!path || !geometry.d) return;
    const length = path.getTotalLength();
    const map = mapRef.current;
    const list = listRef.current;
    if (!map || !list || !length) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const centers = getCardCenters(map, list, isMobile);
    const anchors = centers.map((center) => closestProgress(path, center, length));
    setPathLength(length);
    setAnchorProgress(anchors);
  }, [cardRefs, geometry.d, listRef, mapRef]);

  const followProgress = useCallback((value: number) => {
    const path = basePathRef.current;
    if (!path || !pathLength) return;
    const clampedProgress = Math.max(0, Math.min(1, value));
    const distance = clampedProgress * pathLength;
    const point = path.getPointAtLength(distance);
    const before = path.getPointAtLength(Math.max(0, distance - 2));
    const after = path.getPointAtLength(Math.min(pathLength, distance + 2));
    dotX.set(point.x);
    dotY.set(point.y);
    dotAngle.set(Math.atan2(after.y - before.y, after.x - before.x) * (180 / Math.PI));
    dashOffset.set(pathLength * (1 - clampedProgress));

    let activeIndex = 0;
    anchorProgress.forEach((anchor, index) => {
      if (value >= anchor) activeIndex = index;
    });
    onActiveStep(activeIndex);
  }, [anchorProgress, dashOffset, dotAngle, dotX, dotY, onActiveStep, pathLength]);

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
              d={arrow.d}
              x={arrow.x}
              y={arrow.y}
              index={index}
              staticMotion={staticMotion}
            />
          ))}
          <motion.g
            className={`process-path__dot${staticMotion ? " process-path__dot--hidden" : ""}`}
            style={{ x: dotX, y: dotY, rotate: dotAngle }}
          >
            <circle r="10" className="process-path__dot-halo" filter="url(#process-path-dot-glow)" />
            <circle r="2.5" className="process-path__dot-core" />
            <path d="M -5 -5 L 2 0 L -5 5" className="process-path__dot-arrow" filter="url(#process-path-dot-glow)" />
          </motion.g>
        </>
      )}
    </svg>
  );
}
