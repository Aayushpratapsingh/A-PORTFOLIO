"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type WireframeCanvasProps = {
  pointer: { x: number; y: number };
  active: boolean;
};

const radius = 1.16;
const circleSamples = 180;

function createHologramGeometry() {
  const lines: number[] = [];

  const appendArc = (
    pointAt: (angle: number) => THREE.Vector3,
    start: number,
    end: number,
    steps: number,
    gapSeed: number,
  ) => {
    let previous: THREE.Vector3 | null = null;
    for (let index = 0; index <= steps; index += 1) {
      const progress = index / steps;
      const gap = Math.sin(progress * 31 + gapSeed) > -0.78;
      const point = pointAt(start + (end - start) * progress);
      if (previous && gap) {
        lines.push(previous.x, previous.y, previous.z, point.x, point.y, point.z);
      }
      previous = gap ? point : null;
    }
  };

  for (let ring = 0; ring < 43; ring += 1) {
    const latitude = -Math.PI * 0.48 + (Math.PI * 0.96 * ring) / 42;
    const ringRadius = radius * Math.cos(latitude);
    const z = radius * Math.sin(latitude);
    const pointAt = (angle: number) =>
      new THREE.Vector3(
        ringRadius * Math.cos(angle),
        ringRadius * Math.sin(angle),
        z,
      );
    appendArc(pointAt, 0, Math.PI * 2, circleSamples, ring * 1.71);
  }

  for (let meridian = 0; meridian < 64; meridian += 1) {
    const longitude = (Math.PI * 2 * meridian) / 64;
    const pointAt = (angle: number) =>
      new THREE.Vector3(
        radius * Math.cos(angle) * Math.cos(longitude),
        radius * Math.cos(angle) * Math.sin(longitude),
        radius * Math.sin(angle),
      );
    appendArc(pointAt, -Math.PI / 2, Math.PI / 2, 120, meridian * 2.13);
  }

  for (let trace = 0; trace < 520; trace += 1) {
    const seed = trace * 127.1;
    const longitude = ((Math.sin(seed) + 1) * Math.PI) % (Math.PI * 2);
    const latitude = Math.asin(Math.sin(seed * 0.73)) * 0.92;
    const length = 0.025 + ((Math.sin(seed * 1.91) + 1) * 0.055);
    const start = longitude + Math.sin(seed * 2.37) * 0.08;
    const end = start + length;
    const pointAt = (angle: number) => {
      const lat = latitude + Math.sin((angle - start) * 4) * 0.012;
      return new THREE.Vector3(
        radius * Math.cos(lat) * Math.cos(angle),
        radius * Math.cos(lat) * Math.sin(angle),
        radius * Math.sin(lat),
      );
    };
    appendArc(pointAt, start, end, 5, seed);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lines, 3),
  );
  return geometry;
}

function createParticleGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const shades = [
    new THREE.Color("#ff6a24"),
    new THREE.Color("#ff9b36"),
    new THREE.Color("#ffd07a"),
  ];

  for (let index = 0; index < 4200; index += 1) {
    const y = 1 - (index / 4199) * 2;
    const ringRadius = Math.sqrt(1 - y * y);
    const angle = goldenAngle * index;
    const variation = Math.sin(index * 12.9898) * 0.5 + 0.5;
    const distance = radius * (0.975 + variation * 0.04);
    positions.push(
      Math.cos(angle) * ringRadius * distance,
      y * distance,
      Math.sin(angle) * ringRadius * distance,
    );

    const color = shades[Math.floor(variation * shades.length)] ?? shades[0];
    const brightness = 0.35 + variation * 0.65;
    colors.push(color.r * brightness, color.g * brightness, color.b * brightness);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

function OrbitalRings() {
  const ringMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#ff9b36",
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [],
  );

  return (
    <group>
      {[
        { radius: 1.25, rotation: [0.18, 0.16, 0.12] },
        { radius: 1.31, rotation: [1.12, 0.28, 0.42] },
        { radius: 1.35, rotation: [0.66, 1.04, -0.32] },
        { radius: 0.62, rotation: [0.8, 0.2, 0.4] },
      ].map((ring, index) => (
        <mesh
          key={index}
          rotation={ring.rotation as [number, number, number]}
        >
          <torusGeometry
            args={[ring.radius, index === 3 ? 0.003 : 0.002, 4, 180]}
          />
          <primitive object={ringMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

function HolographicOrb({
  pointer,
}: Pick<WireframeCanvasProps, "pointer">) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const lineGeometry = useMemo(() => createHologramGeometry(), []);
  const particleGeometry = useMemo(() => createParticleGeometry(), []);
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#ffb34d",
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [],
  );
  const pointMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    elapsed.current += delta;
    const targetX = pointer.y * 0.2;
    const targetY = elapsed.current * 0.075 + pointer.x * 0.24;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      1.7,
      delta,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      1.7,
      delta,
    );
  });

  return (
    <group ref={group} scale={1}>
      <mesh geometry={lineGeometry}>
        <primitive object={lineMaterial} attach="material" />
      </mesh>
      <points geometry={particleGeometry}>
        <primitive object={pointMaterial} attach="material" />
      </points>
      <OrbitalRings />
    </group>
  );
}

export default function WireframeCanvas({
  pointer,
  active,
}: WireframeCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 38 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      aria-hidden="true"
    >
      <HolographicOrb pointer={pointer} />
    </Canvas>
  );
}
