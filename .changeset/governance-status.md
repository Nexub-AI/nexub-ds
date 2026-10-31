---
"@nexub/react": patch
"@nexub/mcp": patch
---

Governance and component status. New `GOVERNANCE.md`: RFCs (when they are required and a template), who decides, the `alpha → beta → stable → deprecated` lifecycle with promotion criteria, and the deprecation policy (deprecate in a minor, remove only in the next major). The `@deprecated` JSDoc on `Banner`, `Callout`, `Tag` and `StatusPill` now says their removal is planned in 3.0 (it said 1.0); no behaviour change. The docs show a status badge on every component page, including Alpha on the React Native pages, and a "Deprecated — removal planned in 3.0" notice with the replacement on deprecated ones; the AI references in `@nexub/mcp` carry the same removal note.
