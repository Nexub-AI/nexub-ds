---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/react-native': minor
---

Motion presets by intent: `enter`, `exit`, `emphasis`, `success` and `attention`, each an alias of a spring token. `@nexub/tokens` adds `--motion-preset-<intent>-easing` / `-duration`, Tailwind `ease-<intent>` / `duration-<intent>`, `tokens.motion.preset` and `native.motion.preset`.
`@nexub/themes` adds utility classes `nx-motion-enter`, `nx-motion-exit`, `nx-motion-emphasis`, `nx-motion-success` and `nx-motion-attention` (part `motion-presets`); under `prefers-reduced-motion` enter and exit land at once and the rest don't move. Overlays, the shake, the count tick, the success check and the signature Switch thumb now read their preset (same springs, no visible change).
`@nexub/react`: Switch and Toast now use the matching presets (same springs, no visible change).
`@nexub/react-native` adds `nxPreset(intent)` (a `withSpring` config that follows Reduce Motion), the `MotionPreset` type, a `success` haptic token and `presetHaptic` (emphasis → selection, success → success, attention → warning). New opt-in `haptic` on `Banner` and on `toast({ … })` plays the tone's haptic (success, warning, or the error haptic for danger), off by default and silent when the user turned haptics off or the platform has none. Toast and Dialog springs now read `nxPreset('enter' | 'exit')` (same values).
