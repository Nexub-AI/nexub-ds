---
'@nexub/react': minor
---

8.3: visual completeness and flake debt. No new API.

- Stories and visual/a11y baselines for the 11 components that had none: ActionBar, AgentKit (with ApprovalCard), DataTableVirtual, Fieldset, FloatingInput, MoneyInput, NavigationRail, ResizablePanels, ScrollProgress, SharedElement, SplitButton.
- Fix: a `Table`/`DataTable` that only scrolls vertically (`maxHeight`) is now a focusable, named scroll region, like a horizontally overflowing one (WCAG 2.1.1).
- CI: recurring flakes fixed at the cause (cached Maestro download with backoff, warm iOS first launch, the iOS open-link prompt, Android post-boot settle, the RN Select first-sheet cost, the motion page's full-page reflow). Playwright retries once in CI only; a quarantine list that may only shrink; a flake report on every visual run.
