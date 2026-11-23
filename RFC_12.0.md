# RFC: 12.0 — the clean break

<!-- The text of the RFC issue (GOVERNANCE.md → RFC process). Open a GitHub issue with this title and the body below. -->

Open for comments for at least **3 working days** from the day this issue is opened. A maintainer then records the decision here (accepted, accepted with changes, or declined) and closes the issue. The 12.0 PR links it.

## Decision

**Open.** Not yet decided. `APPROVED_MAJOR` stays at 11 until a maintainer accepts this RFC. Then the acceptance PR raises it to 12 (`scripts/release-version.mjs`), which lets a `major` changeset through for one release.

Release candidate: **11.9.x on the npm tag `next`**, once this RFC is accepted. `latest` stays on 11.8.x until 12.0.0.

## Problem

`ROADMAP_12.x.md` gives 12.0 three jobs: removals, default changes and promotions. While writing this RFC, two of the roadmap's items turned out not to match the code:

1. **There is no Tailwind v3 preset to freeze.** 4.0 removed the `@nexub/tokens/tailwind` preset (`82df5ba1`), and the `tailwind-3-preset` rule in `nexub-migrate` has moved apps off it since then. Decision 2 ("the v3 preset is frozen and deprecated in 12.0, removed in 13.0") describes a file that doesn't exist. Two pieces of v3 support do remain:
   - **`tailwind-v3-compat.css`, bundled into `@nexub/react/styles.css`.** It restores v3 defaults that v4 changed, such as gray-200 as the unspecified border colour, so components look the same in a v3 or v4 app.
   - **Stale advice in `packages/patterns/README.md`,** which still points v3 apps at the removed preset. This is a docs fix and ships in 11.9 as a patch.
2. **The component token tier needs no major.** It comes in 12.5 (after 12.0). Component tokens default to the semantic tokens they replace, so turning the tier on changes no colour or size. It ships in 12.5 as an additive minor, and this RFC drops it.

So the breaking changes in 12.0 are these:

- **One removal:** `Stepper current={-1}`. It was deprecated in 11.4 and is the only deprecation 11.x made.
- **One default change:** cascade layers (decision 2).
- **One change that needs the maintainers' call (open question 1):** removing the v3 compatibility defaults from `styles.css`.

## Proposal

### 1. Remove `Stepper current={-1}`

`current={-1}` means "every step is done". It was deprecated in 11.4; give the steps a `status` instead. In 12.0 a negative `current` throws in development and is treated as `0` in production.

### 2. Everything in `@nexub/react/styles.css` goes in one `nexub` layer

Today the prebuilt CSS declares Tailwind's own layer names (`@layer theme, base, components, utilities`). An app that also uses Tailwind v4 shares those layers. Its utilities and Nexub's then mix in one `utilities` layer, ordered by source order: whichever file loads last wins a tie. In 12.0 the file becomes:

```css
@layer nexub.theme, nexub.base, nexub.components, nexub.utilities;
```

Declared before the app's CSS, `nexub` is the lowest layer. Every app style beats it without `!important`, whether unlayered, in the app's own Tailwind layers or in any later layer. This is what the 11.x comment in `styles.css` promises, but it only holds for unlayered CSS today.

- **Opt-in first:** 11.9 ships `@nexub/react/styles.nexub-layer.css`, the 12.0 file, so apps can switch and check before the major.
- **The `@nexub/themes/*` files** are already imported `layer(base)` by the app (the docs snippet). They are unchanged.

### 3. Open: the Tailwind v3 compatibility defaults

The v3 compatibility defaults (`tailwind-v3-compat.css`) can either stay or go in 12.0. Options for the maintainers:

- **(a) Keep them in 12.0, deprecate them, remove them in 13.0.** This keeps decision 2's timing and moves the deprecation onto the thing that actually exists. *Recommended.*
- **(b) Remove them in 12.0.** This breaks the deprecation policy: nothing in an 11.x minor deprecated them.

### Promotions

At least 30 `beta` components move to `stable` (GOVERNANCE.md: promotion comes from real use).

- **How they're chosen:** by `nexub-usage` reports from the platform apps. The maintainers run them, because the apps' code isn't in this repository.
- **No API change:** a promotion only changes the docs badge and `accessibility.json`.
- **List:** added here before acceptance.

## API

```tsx
// 11.x: deprecated          12.0
<Stepper current={-1} … />   // → <Stepper current={steps.length - 1} steps={steps.map((s) => ({ ...s, status: 'complete' }))} />
```

```css
/* 11.x */
@layer theme, base, components, utilities;
/* 12.0 (and @nexub/react/styles.nexub-layer.css from 11.9) */
@layer nexub.theme, nexub.base, nexub.components, nexub.utilities;
```

No other export, prop or token changes.

## Accessibility

- **Stepper:** a `status` per step is read the same way as the old "every step done" state, as "Step 3 of 3, complete".
- **Layers:** these change which style wins, not markup. Focus rings and the forced-colors styles stay in `nexub.base` and `nexub.components`. An app that styles `:focus-visible` itself now wins over them, which is the point. The visual contrast tests run on the layered file in 11.9 before the switch.

## Web + native parity

All three changes are web only. Native has no CSS and no `current={-1}`. Its `StepProgress` already uses per-step status (11.8).

## Alternatives

- **No 12.0.** Keep the generic layer names forever. The app-vs-Nexub tie then depends on import order, which is what this RFC fixes.
- **Only unlayer the utilities.** A smaller change, but app Tailwind classes still interleave with Nexub's.
- **Remove more.** Nothing else was deprecated in 11.x, and the policy removes only what a minor deprecated first.

## Migration

- **`nexub-migrate`:** `npx nexub-migrate --rules deprecated-in-11` already reports `current={-1}`. 12.0 adds `changes-in-12`, which rewrites `@nexub/react/styles.nexub-layer.css` imports back to `styles.css`, rewrites `current={-1}` where `steps` is a literal array, and reports the rest. `--check` fails CI while anything is left.
- **Guide:** `/getting-started/migrating-to-12` in the docs.
- **Try it first:** 11.9.x on `next` ships the opt-in layered file. An app that runs clean on 11.9 with that file and `deprecated-in-11` upgrades with a version bump.

## Open questions for the maintainers

1. The v3 compatibility defaults: (a) or (b) above.
2. The promotion list: which `nexub-usage` reports to use.
3. Correct decision 2 in `ROADMAP_12.x.md` to say that the preset has been gone since 4.0.
