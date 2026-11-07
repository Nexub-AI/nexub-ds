---
"@nexub/react": minor
"@nexub/core": minor
---

Layout and flow.

- **`ResizablePanels`** (new, beta): panels with draggable separators (ARIA window splitter). Arrow keys move a focused separator by 5% (mirrored in RTL), Home/End to its limits, Enter back to the default split. `sizes` / `onSizesChange` in percent so your app can persist the layout; `minSizes` per panel; horizontal or vertical.
- **`Stepper`** (new, beta): progress through a multi-step flow. `current`, `completed`, and `onStepChange` makes reachable steps clickable (linear by default, `nonLinear` to allow any). Each step reads "Step 2 of 4: Billing", with "completed" when done. Horizontal or vertical. It will replace the patterns `StepIndicator` in 7.0.
- **`ActionBar`** (new, beta): save / cancel that stay in view at the bottom of a long form, with a polite status `message`.
- New messages: `stepOf`, `stepCompleted`, `resizePanels`.
