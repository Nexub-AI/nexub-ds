---
'@nexub/tokens': minor
'@nexub/react': minor
---

**Token tiers complete** (12.6, closes R3): reference tokens → semantic roles → component tokens, each tier aliasing the one before it. No token value changes.

- Chip joins the component tier: `--chip-neutral-bg`, `--chip-neutral-fg`, `--chip-neutral-border` (the neutral tone) and `--chip-radius`. Like every component token they are unset by default and fall back to the role Chip used before, so nothing changes until you set one.
- `@nexub/tokens/json/component` now names the docs pages that read each group (`$extensions["dev.nexub"].docs`), and each covered component's docs page has a generated "Design tokens" section listing its tokens and the role each one aliases. The Tokens foundations page explains the three tiers.
- Native parity gap: `@nexub/tokens/native` has no component tier yet (native components read the semantic roles directly); its output is unchanged.
