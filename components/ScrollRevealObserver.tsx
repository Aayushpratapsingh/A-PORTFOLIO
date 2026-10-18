"use client";

import { useEffect } from "react";

export default function ScrollRevealObserver() {
  useEffect(() => {
    const targets = new Set<Element>();
    const revealAll = () => {
      document.querySelectorAll("[data-reveal]").forEach((target) => {
        target.classList.add("is-revealed");
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
          targets.delete(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const observe = (root: ParentNode) => {
      const candidates = Array.from(root.querySelectorAll("[data-reveal]:not(.is-revealed)"));
      if (root instanceof Element && root.matches("[data-reveal]:not(.is-revealed)")) {
        candidates.unshift(root);
      }
      candidates.forEach((target) => {
        if (targets.has(target)) return;
        const bounds = target.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) {
          target.classList.add("is-revealed");
          return;
        }
        targets.add(target);
        observer.observe(target);
      });
    };

    observe(document);
    document.documentElement.classList.add("motion-ready");
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          observe(node);
        }
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      targets.clear();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
