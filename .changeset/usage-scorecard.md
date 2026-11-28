---
'@nexub/tokens': minor
---

**Usage scanner per app** (12.7, closes R6): `nexub-usage --apps <app-dir>…` prints one adoption report per app. The existing table, `--json`, `--css` and `--prune` are unchanged.

- Counts the Nexub components each app renders and the props it passes to each, the `@nexub` versions its `package.json` files ask for, and deprecated or removed APIs (from the `nexub-migrate` rules).
- Counts local overrides: a `className` that restyles a Nexub component (classes that only place it, such as margin, width or flex, are left out), `style` on one, CSS or Tailwind that targets `.nx-*` classes, and app code that redefines a Nexub custom property.
- Flags likely copies of Nexub parts (a heuristic): a local component with a Nexub component's name that draws its own markup, or one that sets an ARIA role a Nexub part owns.
- `--wrapper <package-dir>` reads a workspace package that wraps Nexub parts (such as an app's own admin kit) and counts its users as indirect users of the parts each wrapper renders. `--stopgaps <file>` lists wrapper exports Nexub has replaced and reports which apps still import them. `--parts <file>` gives the component list for copies when the Nexub packages are not installed; `--tests` includes test and story files; `--json` prints the full reports.
- The docs have a new Components › Adoption page: a health scorecard for each Nexub app (version, coverage, overrides, copies, deprecated APIs, admin-ui stopgaps left, and a grade whose rule is on the page), the admin-ui tracker, and the scan's findings for 13.x.
