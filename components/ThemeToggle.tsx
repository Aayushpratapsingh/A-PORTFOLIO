"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-theme";

const listeners = new Set<() => void>();

// useSyncExternalStore keeps every theme control in sync with the document-level theme attribute.
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function publishTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  listeners.forEach((listener) => listener());
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const initialTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : systemTheme();
    publishTheme(initialTheme);

    if (!storedTheme) {
      const media = window.matchMedia("(prefers-color-scheme: light)");
      const syncSystemTheme = (event: MediaQueryListEvent) => {
        if (window.localStorage.getItem(STORAGE_KEY)) return;
        publishTheme(event.matches ? "light" : "dark");
      };
      media.addEventListener("change", syncSystemTheme);
      return () => media.removeEventListener("change", syncSystemTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = getThemeSnapshot() === "dark" ? "light" : "dark";
    publishTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "light"}
      className="motion-control inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:text-white"
    >
      {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
