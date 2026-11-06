---
"@nexub/react": minor
"@nexub/themes": minor
---

Page and state transitions.

- **`SharedElement`**: gives its child a `view-transition-name` (through the CSSOM, so CSP-safe). Wrap the same thing on both sides, say a list avatar and the detail avatar, run the change in `startViewTransition()`, and the browser morphs one into the other.
- **`ScrollProgress`**: a thin bar along the top that fills as the page scrolls, driven by a CSS scroll timeline. No JavaScript, server component, the Vivid gradient under `data-expression="vivid"`. Hidden where unsupported and under reduced motion.
- **`FloatingInput`**: the label sits inside the empty field and floats above the value on focus or input. Pure CSS, server-safe, and the label stays a real `<label>`.
