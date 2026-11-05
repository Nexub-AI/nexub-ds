---
"@nexub/tokens": minor
---

Data and governance.

- **`nexub-usage`**: a new CLI in `@nexub/tokens` that counts which `@nexub` exports your code imports, per package and export, across one or more folders. Run `npx -p @nexub/tokens nexub-usage ./apps/web ./apps/admin` for a Markdown table or add `--json`. Share the result with the design system team so deprecations and codemods follow real usage.
- **Component status page** at /components/status: every component and pattern with its lifecycle status on web and native (alpha, beta, stable, deprecated), the version it was added in and last changed in, and a count per status.
