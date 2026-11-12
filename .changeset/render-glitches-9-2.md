---
'@nexub/react': minor
---

9.2 Render glitches. Every story now renders under `StrictMode` and hydrates its `renderToString` HTML with no console error or mismatch (`render-glitches.test.tsx`). A no-flash test blocks every script bundle and checks that `ThemeScript` alone puts the stored theme, contrast and brand on `<html>` and paints them. Docs: CLS 0 is a gate on every page, with a Lighthouse budget of 0.001 (0.000 as Lighthouse reports it). Live previews are resolved on the server before render (no 120px skeleton or streamed-Suspense swap; examples are client modules), the latin webfonts are preloaded (the swap rewrapped headings), and the motion gallery animates by transform. Five previews whose components measure themselves on mount keep a shrink-only cap. Avatar, MediaCard and skeleton-to-content swaps are checked for layout shift with images arriving late.
