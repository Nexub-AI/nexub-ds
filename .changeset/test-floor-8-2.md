---
'@nexub/react': minor
'@nexub/react-native': minor
---

8.2: test floor. No new API.

- A smoke test renders every exported web (157) and React Native (93) component with no console errors and checks accessible names. A new export without a test fails CI.
- Behaviour tests for every component that had none: the 8 web gaps (ActionBar, Amount, DateTimePicker, Fieldset, FloatingInput, Kanban, ResizablePanels, ScrollProgress) and 41 React Native components, overlays and inputs first.
- Coverage is reported and gated in `@nexub/react`, `@nexub/patterns`, `@nexub/marketing` and `@nexub/react-native`, with thresholds at today's numbers. They only go up.
- Fix: the outside-PR auto-close (8.1) closed maintainers' own PRs when their org membership is private. It now closes only PRs from forks.
- Fix (React Native): a disabled `Slider` now reports `disabled` to screen readers, and VoiceOver/TalkBack increment/decrement no longer change it.
