---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/patterns': minor
---

Wave 1 — secure and consistent (ENHANCEMENTS_PLAN.md).

- **Strict CSP.** Layout and text components render scale values as classes, so server HTML carries no `style` attribute (blocked under `style-src` without `'unsafe-inline'`): `Stack`/`Flex`/`Grid` (`gap`, `align`, `justify`, `cols`, `rows`), `Text` `lineClamp` 1–6, `Heading`/`Label`/`HelperText` `tone`, `AspectRatio` common ratios, `Skeleton` defaults, `GradientDivider`, auto-growing `Textarea`. Off-scale values still fall back to inline style. `Progress` sets its fill through the CSSOM.
- **Every component on Calm Depth.** The ~45 components the refresh hadn't reached now use colour roles, shape and elevation tokens, the global focus ring, colour-based disabled states and the state layer. Brand tones (`leap`, `bookub`, `payub`, `founderub`) now tint text in `Heading`, `Label`, `HelperText` and `EyebrowChip` instead of falling back.
- **Brand accent roles.** `--color-leap`, `--color-on-leap`, `--color-leap-container`, `--color-on-leap-container` (and the same for `bookub`, `payub`, `founderub`), with light/dark and high-contrast values, plus Tailwind colours of the same names. New `--gradient-brand-vertical`.
- **Spring enter/exit.** Overlays, menus, tooltips and toasts animate with `nx-motion` (themes/base.css): opacity on the effects spring, scale and travel on the spatial spring, quicker exits, and a crossfade-only fallback under reduced motion. Components no longer depend on `tailwindcss-animate` (the preset still registers it for your own classes).
