---
'@nexub/react': minor
---

9.1 Every browser. Playwright now runs every story, the interaction states and the docs suites in WebKit (the Safari stand-in) and Firefox as well as Chromium, with baselines per engine. The supported browsers are written down (last 2 Chrome, Edge, Firefox and Safari; iOS Safari 17.5+) as the `browserslist` in `@nexub/themes`, and CI compiles the theme CSS for that list and fails if any rule would need a prefix or fallback the source lacks. Fixes from that check: `-webkit-text-size-adjust` (iOS no longer inflates text in landscape), `-webkit-user-select` for dragging and the drawer, and the unprefixed `mask` beside `-webkit-mask` on the gradient rings.
