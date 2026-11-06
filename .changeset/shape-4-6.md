---
"@nexub/themes": minor
"@nexub/react": minor
---

Shape, Glass 3.0 and interactive legends.

- **Squircle corners:** `data-shape="squircle"` on any area gives its rounded corners the continuous, Apple-style curve where CSS `corner-shape` is supported; other browsers keep normal round corners.
- **Glass 3.0 edge:** a specular rim that catches light like a lens. On by default for glass surfaces under `data-expression="vivid"`; anywhere else add `nx-glass-edge`. Off for reduced transparency and forced colours.
- **`ChartToggle`:** wraps any chart with a legend whose entries are toggle buttons (`aria-pressed`). Colours stay stable as series hide, and the last series always stays on.
