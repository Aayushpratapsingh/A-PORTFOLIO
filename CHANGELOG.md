# Changelog

## 2026-10-16 — Editorial portfolio redesign

- Established the Signal design system: ink and paper foundations, lime accent, semantic light/dark tokens, fluid typography, spacing, shape, shadow, and motion tokens.
- Paired Space Grotesk display type with IBM Plex Sans body text and IBM Plex Mono labels; enabled swap behavior and theme preference persistence.
- Rebuilt the navigation and page shell with a sticky section-aware nav, accessible mobile menu, skip link, and footer.
- Redesigned the hero, project showcase, About/Skills, and Contact sections with editorial hierarchy, responsive layouts, and restrained motion.
- Added accessible project filters and keyboard-operable interactions; honors reduced-motion preferences.
- Optimized the active portfolio images to WebP and removed unused starter graphics and original image copies from the public directory.
- Kept the contact destination on the existing `mailto:` address. The form validates input and prepares an email draft in the visitor's mail app; delivery is completed by the visitor.
- Audited accessibility, responsive behavior, and production performance. Latest clean production Lighthouse scores: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 2.6 s and CLS 0.00. Performance varied from 95–97 and LCP from 2.6–2.9 s between local runs.
