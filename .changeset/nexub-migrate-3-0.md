---
"@nexub/tokens": minor
---

`nexub-migrate` gains a `deprecated-components` rule for the 3.0 removals: `Banner` and `Callout` become `Alert`, `Tag` becomes `<Badge variant="soft">`, and `StatusPill label="x"` becomes `<Badge variant="soft">x</Badge>`. It also renames the `*Props` types and dedupes imports. It reports `StatusPill dot`, the `*Variants` exports and uses outside JSX. New docs page: Migrating to 3.0.
