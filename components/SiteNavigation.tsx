"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = [
  { label: "HOME", href: "/#home" },
  { label: "WORK", href: "/#design" },
  { label: "PROCESS", href: "/#process" },
  { label: "ABOUT", href: "/#about" },
  { label: "CONTACT", href: "/#contact" },
];

const projectLinks = [
  { label: "PERSPECTIVE / BRAND IDENTITY", href: "/#design" },
  { label: "AIR JORDAN / PRODUCT DESIGN", href: "/#design" },
  { label: "SWIFLO / DIGITAL WALLET", href: "/#work" },
  { label: "ALPHA / WEB EXPERIENCE", href: "/#work" },
];

export default function SiteNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!menuOpen) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current
      ?.querySelector<HTMLElement>("a[href]")
      ?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !overlayRef.current) return;
      const focusable = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-nav">
        <nav className="site-nav__inner film-nav" aria-label="Main navigation">
          <a className="site-nav__brand" href="/#home" aria-label="Aayush Singh home">
            AS
          </a>
          <button
            ref={triggerRef}
            type="button"
            className="film-nav__menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "film-menu" : undefined}
            onClick={() => setMenuOpen((open) => !open)}
          >
            MENU
            {menuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="film-menu-backdrop"
            initial={reducedMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={reducedMotion ? undefined : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div
              id="film-menu"
              ref={overlayRef}
              className="film-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="film-menu__top">
                <span className="mono-label">AAYUSH PRATAP SINGH / INDEX</span>
                <button
                  type="button"
                  className="film-menu__close"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  CLOSE <X size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="film-menu__content">
                <nav className="film-menu__links" aria-label="Scenes">
                  {links.map((link, index) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>0{index}</span>
                      <span>{link.label}</span>
                    </a>
                  ))}
                </nav>
                <div className="film-menu__projects">
                  <p className="mono-label">PROJECT INDEX</p>
                  {projectLinks.map((project) => (
                    <a
                      key={project.label}
                      href={project.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {project.label}
                    </a>
                  ))}
                </div>
              </div>
              <p className="film-menu__foot mono-label">
                UI/UX / FULL STACK / VIDEO PRODUCTION
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
