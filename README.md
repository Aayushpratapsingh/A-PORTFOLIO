# Aayush Singh — Portfolio

A Next.js portfolio for frontend development and UI/UX design work.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production build, run `npm run build` and then `npm run start`. Run `npm run lint` to check the app and component source.

The build uses `next/font/google` for Space Grotesk, IBM Plex Sans, and IBM Plex Mono; a network connection is required when those font files are not already cached.

## Design system

The design system lives in [`app/globals.css`](app/globals.css). CSS custom properties define the signal palette, semantic foreground/surface colors, fluid type scale (`clamp()`), spacing, radii, shadows, easing, and motion durations. Components should use these semantic tokens so the site stays coherent across themes.

The default theme follows the visitor's system preference. The navigation toggle changes the document theme and saves the choice in local storage. Motion is reduced when the visitor enables `prefers-reduced-motion`. The type pairing is Space Grotesk for display text, IBM Plex Sans for body text, and IBM Plex Mono for small labels.

## Project structure

```text
app/                  Next.js App Router page, root layout, and global styles
components/           Interactive and reusable page components
public/images/         Optimized WebP portfolio imagery
CHANGELOG.md           Record of the redesign decisions
```

`app/page.tsx` contains the portfolio content and project data. Interactive behavior is isolated in `components/`: navigation and theme, project filters, reveal/cursor effects, and the contact form. Contact submissions use the existing `mailto:` address: the form validates and prepares a draft in the visitor's email app; it does not send through a server API.

## Accessibility and responsive behavior

The page includes semantic landmarks, a skip link, visible keyboard focus, labeled form fields and status announcements, theme-aware colors, and reduced-motion support. Layouts are designed mobile-first and have been checked at 320, 768, 1024, 1440, and 1920 px.

# A-PORTFOLIO
