"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const cursor = document.createElement("span");
    cursor.className = "custom-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    const experience = document.querySelector<HTMLElement>(".film-experience");

    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (event: PointerEvent) => {
      const target = event.target;
      if (!experience || !(target instanceof Element) || !target.closest(".film-experience")) {
        cursor.classList.remove("is-visible");
        experience?.classList.remove("custom-cursor-enabled");
        return;
      }

      experience.classList.add("custom-cursor-enabled");
      x = event.clientX;
      y = event.clientY;
      cursor.classList.toggle("is-hovering", target instanceof Element && Boolean(target.closest("a, button, [data-cursor-interactive]")));
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        cursor.classList.add("is-visible");
        frame = 0;
      });
    };
    const hide = () => {
      cursor.classList.remove("is-visible");
      experience?.classList.remove("custom-cursor-enabled");
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("mouseleave", hide);
      if (frame) window.cancelAnimationFrame(frame);
      experience?.classList.remove("custom-cursor-enabled");
      cursor.remove();
    };
  }, []);

  return null;
}
