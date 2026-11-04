---
"@nexub/react": minor
---

**Breaking:** `Banner`, `Callout`, `Tag` and `StatusPill` are removed, along with `BannerProps`, `CalloutProps`, `TagProps`, `StatusPillProps`, `bannerVariants`, `calloutVariants`, `tagVariants` and `statusPillVariants`. They had been deprecated since 1.1. Use `Alert` and `<Badge variant="soft">` instead. `npx nexub-migrate src --write` rewrites them, and reports the few uses it can't rewrite (`StatusPill dot`, the `*Variants` exports, uses outside JSX). See the Migrating to 3.0 page.
