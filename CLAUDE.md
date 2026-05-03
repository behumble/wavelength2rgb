# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server at http://localhost:5173.
- `npm run build` — Production bundle to `dist/`.
- `npm run preview` — Serve the production build locally.

There is no test runner, linter, or type checker configured. Don't claim a change is verified by tests when none exist; either add one or say it's unverified.

## Architecture

Single-page Vite + React 18 app (JSX, no TypeScript). Three concerns are isolated into their own modules and composed in `App.jsx`:

- **`src/wavelengthToRgb.js`** — Pure conversion. Implements Dan Bruton's piecewise wavelength→RGB mapping (380–780 nm) with intensity falloff at the spectrum edges and gamma 0.8. Outside the visible band it returns `{0,0,0}`. Keep this file framework-free so it stays trivially testable.

- **`src/i18n.js`** — Hand-rolled i18n (no library). Exports `SUPPORTED = ['en','ko']` and a `useLocale()` hook. Resolution order on first load: `localStorage['wavelength2rgb.locale']` → first match in `navigator.languages` → `'en'`. The hook persists changes to `localStorage` and writes `<html lang>` via effect. All user-facing strings live in the `translations` object — when adding UI text, add a key to **both** `en` and `ko`. Some entries (`t.nm`) are functions, not strings.

- **`src/App.jsx`** — Single component. Owns wavelength state and three side effects:
  1. Initial state reads `window.location.hash` via `parseHashWavelength()` (regex `^#(\d+)$`), defaulting to 550.
  2. An effect mirrors numeric state to the hash via `history.replaceState`. Two reasons not to "simplify" this to `location.hash = …`: direct assignment scrolls to any matching anchor, and `pushState`/direct assignment would create a history entry per slider tick.
  3. A `hashchange` listener handles back/forward and external edits to the hash.

  The number input also accepts `''` (empty) as a transient state during typing; the URL-sync effect guards against this with a `Number.isFinite` check. Don't "fix" the empty-string case by coercing to 0 — that breaks editing.

### URL contract

`#<integer>` sets the wavelength (e.g. `/#600`). Hash-based on purpose: zero server config, works on any static host. Out-of-range integers are accepted into state and rendered as `out of range` (black swatch) rather than rejected — range validation is a UI concern, not a routing one.

### Adding a locale

1. Add the code to `SUPPORTED` in `src/i18n.js`.
2. Add a full translations entry mirroring the `en` shape (including the `nm` function and nested `refs.*`).
3. The switcher in `App.jsx` renders one button per `SUPPORTED` entry automatically — no UI change needed.
