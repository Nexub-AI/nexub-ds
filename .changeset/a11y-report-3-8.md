---
"@nexub/react": minor
---

Accessibility conformance report.

- **`@nexub/react/accessibility.json`**: a WCAG 2.2 AA conformance report for every component and pattern, generated from the test suite and the docs at each release. Per component: the automated result (axe-core WCAG 2.2 A/AA on every Storybook story in light and dark: pass, pass with a documented exception, or not covered), the documented keyboard behaviour and the screen-reader notes. It also states the method and lists every accepted exception, for procurement and audit tooling.
- **Docs page**: Foundations → Accessibility shows the report, with counts and a row per component. It is honest about the gaps: components no story renders yet are marked "not covered", and recorded screen-reader sessions are not published yet.
