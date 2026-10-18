"use client";

import { useEffect, useState } from "react";

// PAGE-OPEN LOADER: edit the phrase and timing here; its visual treatment is grouped in the loader section of globals.css.
const loadingText = "aayush is coding...";
const characterDelay = 105;
const introDuration = 2700;
const backgroundSnippets = [
  'import { useEffect, useState } from "react";',
  'const palette = ["ink", "lime", "paper"];',
  "if (ready) render(<Portfolio />);",
  'function buildInterface() { return "thoughtful"; }',
  'return <Hero name="Aayush" />;',
  "transition: transform 240ms cubic-bezier(...);",
  "const pixels = await imagination();",
  'aria-live="polite" aria-label="Loading portfolio"',
  "const rhythm = [4, 8, 16, 32];",
  'export default function App() { /* create */ }',
  "const focus = element.focus({ preventScroll: true });",
  "display: grid; place-items: center;",
  "const motion = prefersReducedMotion ? 0 : 1;",
  'background: var(--color-ink); color: var(--color-lime);',
  "observer.observe(section);",
  'const message = "aayush is coding...";',
];
const backgroundColumns = Array.from({ length: 8 }, (_, columnIndex) =>
  Array.from({ length: 18 }, (_, lineIndex) => backgroundSnippets[(columnIndex * 7 + lineIndex * 11 + columnIndex * lineIndex) % backgroundSnippets.length]),
);

export default function CodeLoadingIntro() {
  const [visible, setVisible] = useState(true);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const removeImmediately = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(removeImmediately);
    }

    let characterIndex = 0;
    const typing = window.setInterval(() => {
      characterIndex += 1;
      setTypedText(loadingText.slice(0, characterIndex));
      if (characterIndex >= loadingText.length) window.clearInterval(typing);
    }, characterDelay);

    const removeIntro = window.setTimeout(() => setVisible(false), introDuration);
    return () => {
      window.clearInterval(typing);
      window.clearTimeout(removeIntro);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="code-intro" role="status" aria-label="Loading portfolio">
      <div className="code-intro__code-field" aria-hidden="true">
        {backgroundColumns.map((column, columnIndex) => (
          <div key={columnIndex} className={`code-intro__code-column code-intro__code-column--${columnIndex + 1}`}>
            {column.map((line, lineIndex) => <span key={`${columnIndex}-${lineIndex}`}>{line}</span>)}
          </div>
        ))}
        <span className="code-intro__sweep code-intro__sweep--one">const experience = accessible &amp;&amp; delightful;</span>
        <span className="code-intro__sweep code-intro__sweep--two">&lt;MakeSomethingUseful /&gt;</span>
        <span className="code-intro__sweep code-intro__sweep--three">{"while (curious) { build(); }"}</span>
      </div>
      <div className="code-intro__terminal" aria-hidden="true">
        <div className="code-intro__window-bar"><i /><i /><i /><span>portfolio.tsx</span></div>
        <p><span className="code-intro__prompt">&gt; </span>{typedText}<span className="code-intro__cursor">|</span></p>
        <div className="code-intro__progress"><span /></div>
        <small>INITIALIZING PORTFOLIO</small>
      </div>
    </div>
  );
}
