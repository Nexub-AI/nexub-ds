---
"@nexub/react": minor
---

**Tabs: inactive panels stay hidden whatever display class they get.** A `Tabs.Content` with `className="flex"` (or `grid`, `md:flex`, …) used to show while inactive, because the class beat the `hidden` attribute. Inactive panels now get `display: none !important`. Apps can drop their `data-[state=inactive]:hidden` workaround.
