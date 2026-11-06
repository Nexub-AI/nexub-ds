---
"@nexub/react": minor
"@nexub/patterns": minor
"@nexub/marketing": minor
"@nexub/themes": minor
---

5.0: Vivid by default, React 19.

- **Vivid is the default expression.** `ThemeProvider` sets `data-expression="vivid"` on `<html>` when the app has not set one. Import `@nexub/themes/vivid` to see it. Keep the 4.x look with `data-expression="calm"` on `<html>` or `<ThemeProvider defaultExpression="calm">`. Calm stays fully supported.
- **React 19 required.** `react` and `react-dom` peers are now `>=19 <20` in `@nexub/react`, `@nexub/patterns` and `@nexub/marketing`.
- The 4.9 development warnings are removed. No component API changes. See /getting-started/migrating-to-5.
