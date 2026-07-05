# AI Shopping Copilot — Chrome Extension (MV3)

A production-ready **Manifest V3** browser extension that injects a floating
**AI Shopping Copilot** widget onto marketplace product pages. Built with
**React + TypeScript + TailwindCSS + Vite**.

> This is the widget shell only — **no business logic yet**. The widget
> currently displays `Loading product…`.

## Supported marketplaces

| Marketplace  | Host             | Product page pattern            |
| ------------ | ---------------- | ------------------------------- |
| Ozon         | `ozon.ru`        | `/product/…`                    |
| Wildberries  | `wildberries.ru` | `/catalog/<id>/detail.aspx`     |
| AliExpress   | `aliexpress.*`   | `/item/<id>.html`               |
| Golden Apple | `goldapple.ru`   | `/<id>-<slug>`                  |

## Widget features

- **Modern Apple-style UI** — glassmorphism, squircle corners, soft shadows.
- **Dark mode** — cycles Light → Dark → System (follows OS), persisted.
- **Draggable** — pointer-based drag, clamped to the viewport, position persisted.
- **Collapsible** — smooth `grid-template-rows` height animation, state persisted.
- **Shadow DOM isolation** — Tailwind CSS is compiled and injected into a Shadow
  root, so the extension **never breaks (and is never broken by) marketplace
  styles**.
- **Smooth animations** — entrance, hover, collapse; respects
  `prefers-reduced-motion`.
- **SPA-aware** — re-detects product pages on client-side navigation.

## Tech stack

- **Manifest V3** (service worker background, no remote code)
- **React 18** + **TypeScript** (strict)
- **TailwindCSS 3** (class-based dark mode)
- **Vite 6** + **@crxjs/vite-plugin** (bundling, manifest, HMR)

## Project structure

```
src/
├── manifest.ts                 # MV3 manifest (typed, via @crxjs)
├── background/
│   └── service-worker.ts       # background worker (future backend calls)
├── content/
│   ├── index.tsx               # entry: Shadow DOM host, mount, SPA nav
│   ├── App.tsx                 # widget composition + state
│   ├── styles.css              # Tailwind entry (injected inline into Shadow DOM)
│   ├── components/
│   │   ├── Widget.tsx          # the floating card UI
│   │   └── icons.tsx           # inline SVG icons
│   ├── hooks/
│   │   ├── useDraggable.ts     # drag + viewport clamping + persistence
│   │   └── useTheme.ts         # light/dark/system theme
│   └── lib/
│       ├── marketplace.ts      # marketplace + product-page detection
│       ├── constants.ts        # storage keys, defaults
│       └── storage.ts          # chrome.storage wrapper (+ fallback)
└── popup/                      # toolbar popup
public/icons/                   # extension icons (16/32/48/128)
```

## Development

```bash
npm install
npm run dev        # Vite dev server with HMR (writes dist/ for loading unpacked)
```

Then load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the generated `dist/` folder

## Production build

```bash
npm run build      # typecheck + production build → dist/
npm run zip        # package dist/ → dist-zip/*.zip for the Web Store
```

## Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Dev server + HMR                         |
| `npm run build`     | Type-check then production build         |
| `npm run typecheck` | `tsc --noEmit`                           |
| `npm run lint`      | ESLint                                   |
| `npm run format`    | Prettier                                 |
| `npm run zip`       | Zip `dist/` for Chrome Web Store         |

## Notes

- **No remote code** is executed (MV3 requirement) — only bundled code runs.
- Permissions are minimal: `storage` + per-marketplace `host_permissions`.
- The widget is appended to `<html>` inside a Shadow DOM host, isolating it from
  marketplace CSS in both directions.
