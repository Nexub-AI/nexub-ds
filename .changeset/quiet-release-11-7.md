---
'@nexub/core': minor
'@nexub/diagram': minor
'@nexub/elements': patch
'@nexub/patterns': patch
'@nexub/react': patch
---

11.7 Quiet release: nothing flaky (ROADMAP_12.x.md). No new components; the follow-ups 11.6 left open, and the release rules for 12.x.

- **`@nexub/react`**: DatePicker `granularity="month"` cells show the full month name ("March", not "Mar"), so each cell's accessible name ("March 2026") starts with its visible text (WCAG 2.5.3 Label in Name). French short months ("janv.") were not a part of the long name at all. Same as `<nx-date-picker>`.
- **`@nexub/core`**: `dateFieldMessages`, the date field strings on their own. `NexubMessages` gains optional `diagram…` keys (`diagramShowAsList`, `diagramConnectTo`, … `diagramMinimap`) for `@nexub/diagram`.
- **`@nexub/diagram`**: `DiagramCanvas` reads its strings from `NexubProvider` `messages`, so a translated provider covers the canvas with the rest of the app. Its `labels` prop still wins; the English defaults stay in `@nexub/diagram`.
- **`@nexub/elements`**: the date picker strings come from `@nexub/core` (`dateFieldMessages`), the same source as React's, instead of a copy. No visible change.
- **`@nexub/patterns`**: each page template ships only its own default strings, not every template's: template entries are 1.5–2.1 kB gzip smaller. `defaultPageTemplateMessages` and `usePageMessages` are unchanged.
- **Native parity:** none needed. The changed strings and templates are web only.
- **Release rules (repo, not packages):** a test that passes only on retry, or a run that passes only after a rerun, opens a `flake` issue; an open one blocks the production release, and so does a staging head under 48 hours old. Lighthouse also runs on mobile emulation (warn only until 12.1).
