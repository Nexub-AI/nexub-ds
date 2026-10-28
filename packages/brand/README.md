# @nexub/brand

The official Nexub brand files. Apps reference these instead of keeping their own copies.

```bash
pnpm add @nexub/brand
```

| File | What it is |
|---|---|
| `nexub-mark.svg` | The Nexub mark in brand colours. Verbatim copy of the master (`5. Logos/Nexub Logo/icon_nexub.svg`). |
| `nexub-mark-mono.svg` | Single-colour mark (`fill="currentColor"`), derived from the master's shapes. |
| `app-icon.svg` | App icon: black glass rounded tile with the Nexub mark. |
| `app-icon-192.png`, `app-icon-512.png` | The same tile for web manifests. |
| `app-icon-account.svg`, `app-icon-account-192.png`, `app-icon-account-512.png` | The Account tile: same tile, person glyph. |
| `app-icon-<product>.svg`, `-192.png`, `-512.png` | Each Nexub app's tile, same tile with its own glyph: `command-hub` (a hub of agents), `admin` (a shield), `people` (two people), `payhub` (a banknote), `commerce` (a shopping bag), `contracts` (a signed page), `leap` (a leap forward), `founder-hub` (a rocket). |
| `app-icon[-<product>]-light.svg` | Every tile again in white glass, for light themes. The black tiles are for dark themes. |
| `favicon.ico` | 16, 32 and 48 px, from `app-icon.svg`. |

Every file is at `@nexub/brand/<file>` (the package maps `./*` to `assets/*`).

In React UI, use `<Logo>` / `<NexubMark>` from `@nexub/react` / `@nexub/icons` rather than these files. They render the same mark from the brand tokens (`--color-brand-mark-*`), so there's no network request.

## Vite apps

**From code** (e.g. `AppLauncher` icons): import the file. Vite copies it into the build and gives you a hashed URL.

```tsx
import hubIcon from '@nexub/brand/app-icon.svg';
import accountIcon from '@nexub/brand/app-icon-account.svg';

<AppLauncher apps={[
  { id: 'hub', name: 'Command Hub', href: 'https://hub.nexub.ai', icon: hubIcon },
  { id: 'account', name: 'Account', href: 'https://account.nexub.ai', icon: accountIcon, current: true },
]} />
```

**From `index.html` and the web manifest**: these need fixed URLs, so copy the files into `public/brand/` before dev and build. Add `public/brand/` to `.gitignore`. It's a build output, not a copy you maintain.

```jsonc
// package.json
"scripts": {
  "brand": "node -e \"require('fs').cpSync('node_modules/@nexub/brand/assets', 'public/brand', { recursive: true })\"",
  "predev": "pnpm brand",
  "prebuild": "pnpm brand"
}
```

```html
<!-- index.html -->
<link rel="icon" href="/brand/favicon.ico" sizes="48x48" />
<link rel="icon" href="/brand/app-icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/brand/app-icon-192.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

```json
// public/manifest.webmanifest
"icons": [
  { "src": "/brand/app-icon-192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "/brand/app-icon-512.png", "sizes": "512x512", "type": "image/png" }
]
```

For the Account app, use the `app-icon-account*` files in those places.

## Plain static serving (no bundler)

Copy the files next to your HTML as part of your deploy step, using the same `cpSync` line with your output folder (for example `dist/brand`). Then reference them as `/brand/<file>` exactly as above. Self-hosting keeps them same-origin, so a strict CSP (`img-src 'self'`) needs no changes.

For a quick prototype you can also link the published files directly, e.g. `https://cdn.jsdelivr.net/npm/@nexub/brand@1/assets/favicon.ico`.

## Adding a product tile

Every product gets the same tile with its own glyph. Don't edit the tile itself.

1. Draw the glyph as an SVG fragment in the 512 × 512 tile space and save it as `glyphs/<product>.svg`. Keep it inside roughly x/y 90–422, the area the Nexub mark uses. Gradients go in a `<defs>` inside the fragment; use `id="glyph"` (see `glyphs/account.svg`).
2. Add `{ id: '<product>', glyph: read('glyphs/<product>.svg'), halo: '<hex>' }` to `PRODUCTS` in `scripts/build-assets.mjs`. `halo` tints the glow behind the glyph.
3. Run `pnpm --filter @nexub/brand build:assets` and commit `assets/app-icon-<product>*` (it also writes the `-light.svg` tile).

Use mid-tone gradient colours for a glyph (roughly Tailwind's 300 to 700 shades), so it reads on both the black and the white tile.

The same script regenerates everything from the master, `assets/nexub-mark.svg`: the mono mark, every tile and PNG, the favicon, the `--color-brand-mark-*` tokens in `@nexub/tokens`, and the path data behind `<NexubMark>`. If the master changes, replace that file (verbatim, never redrawn) and run the script.
