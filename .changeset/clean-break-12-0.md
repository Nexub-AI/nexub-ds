---
'@nexub/react': major
'@nexub/patterns': major
'@nexub/marketing': major
'@nexub/diagram': major
---

12.0, the clean break (RFC 12.0). Guide: `/getting-started/migrating-to-12`. `npx nexub-migrate --rules changes-in-12` rewrites what it can and reports the rest.

- **One `nexub` cascade layer.** `@nexub/react/styles.css`, `@nexub/patterns/styles.css`, `@nexub/marketing/styles.css`, `@nexub/diagram/styles.css` and `@nexub/diagram/theme.css` put every style under `nexub` (`nexub.theme`, `nexub.base`, `nexub.components`, `nexub.utilities`) instead of Tailwind's own layer names. Name it in your CSS so the import order stops mattering: `@layer theme, base, nexub, components, utilities;` in a Tailwind v4 app, `@layer nexub;` first without Tailwind. `@nexub/react/styles.nexub-layer.css`, the 11.9 opt-in name, is now the same file and stays in 12.x.
- **Removed: `Stepper current={-1}`** (deprecated in 11.4). Give the steps `status: 'complete'`. A negative `current` throws in development and counts as `0` in production.
