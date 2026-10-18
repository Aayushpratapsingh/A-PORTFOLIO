"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const categories = ["All", "Brand Identity", "Product Design", "Web Design", "Mobile UI"];

export default function DesignProjectFilters({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gridRef.current?.querySelectorAll<HTMLElement>("[data-project-category]").forEach((card) => {
      card.hidden = selected !== "All" && card.dataset.projectCategory !== selected;
    });
  }, [selected]);

  return (
    <>
      <div className="project-filters" role="group" aria-label="Filter design projects">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelected(category)}
            aria-pressed={selected === category}
            aria-controls="design-projects"
            className={`motion-control${selected === category ? " is-selected" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>
      <div id="design-projects" ref={gridRef} className="project-bento project-bento--design" aria-live="polite">
        {children}
      </div>
    </>
  );
}
