# Roadmap 4.1 → 5.0

Approved 2026-11-06. One release per version, rolling-minor (4.9 rolls over to 5.0), each through development → staging → production → npm ([PUBLISHING.md](PUBLISHING.md)).

**Direction.** Keep Calm Depth as the base and add an opt-in expressive layer, `data-expression="vivid"`, the way Liquid Glass and marketing mode work. The "wow" comes from light and depth, physical motion, shape and one expressive moment per screen, not from more colours. Ground rules: WCAG AA for every pair, reduced motion and reduced transparency respected, CSS and View Transitions before JavaScript, tokens only.

| Version | Theme | Headline |
|---|---|---|
| 4.1 | Quality first | Storybook and axe coverage for every component; charts 1.5 (negative values, hover tooltip, draw-in) |
| 4.2 | Vivid foundations | `data-expression="vivid"`: accent glow, tinted shadows, seed-derived gradients, aurora and mesh surfaces, vivid variants |
| 4.3 | Micro-interactions | Spring press, magnetic and tilt, success moments, floating labels, stretchy switch |
| 4.4 | Page and state transitions | Shared-element View Transitions, scroll-driven animation, skeleton-to-content morph, layout animation |
| 4.5 | Interactive charts 2.0 | Crosshair, heatmap, funnel, gauge, KPI tile (shipped). Legend toggles, zoom and brush, live data moved to 4.6 (they need client-side state) |
| 4.6 | Shape, layout, Glass 3.0 | Squircle corners, shape morphing, bento grid 2.0, refractive glass |
| 4.7 | Docs site "wow" | Live hero, remix this page with a seed, component playground, showcase gallery |
| 4.8 | AI-native UI kit | Plan tracker, tool-call cards, approvals, diff viewer, streaming Markdown, voice input |
| 4.9 | 5.0 release candidate | Feature freeze, deprecations, codemods, Migrating to 5.0 |
| 5.0 | Vivid by default for new apps | Removes the 4.x deprecations; docs version switcher; Calm stays fully supported |

Blocked on outside input: Figma Code Connect (library file and access), native promotion to stable (Payub pilot), Expo Go QR (EAS project), recorded screen-reader sessions.
