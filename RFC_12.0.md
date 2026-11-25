# RFC: 12.0 — the clean break

<!-- The text of the RFC issue (GOVERNANCE.md → RFC process). Open a GitHub issue with this title and the body below. -->

Open for comments for at least **3 working days** from the day this issue is opened. A maintainer then records the decision here (accepted, accepted with changes, or declined) and closes the issue. The 12.0 PR links it.

## Decision

**Accepted with changes** by the owner on 2026-11-26, after the comment period. The answers were given on 2026-11-25:

1. **The v3 compatibility defaults:** option (a). `tailwind-v3-compat.css` stays in 12.0, deprecated, and goes in 13.0.
2. **Promotions:** the 27 components listed under Promotions. That's every component that meets the GOVERNANCE.md rule, not the roadmap's 30.
3. **Decision 2 corrected** in `ROADMAP_12.x.md`: the v3 preset has been gone since 4.0.
4. **Tailwind v4 apps** declare `@layer theme, base, nexub, components, utilities;`. Apps without Tailwind declare `@layer nexub;`.

The acceptance PR raises `APPROVED_MAJOR` to 12 (`scripts/release-version.mjs`), which lets one `major` changeset through, for 12.0.0.

**Release candidate:** this plan is dropped. 11.9.0 already went to `latest` on 2026-11-24, before acceptance. Apps can try the 12.0 layering on 11.9 with `@nexub/react/styles.nexub-layer.css`, so no separate `next` release is needed.

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

`current={-1}` means "every step is done". It was deprecated in 11.4; give the steps a `status` instead. Until 11.9 it also left the last step "upcoming", which is now fixed as a patch so 11.x apps get the meaning the docs promise. In 12.0 a negative `current` throws in development and is treated as `0` in production.

### 2. Everything in `@nexub/react/styles.css` goes in one `nexub` layer

Today the prebuilt CSS declares Tailwind's own layer names (`@layer theme, base, components, utilities`). An app that also uses Tailwind v4 shares those layers. Its utilities and Nexub's then mix in one `utilities` layer, ordered by source order: whichever file loads last wins a tie. In 12.0 the file becomes:

```css
@layer nexub.theme, nexub.base, nexub.components, nexub.utilities;
```

Declared before the app's CSS, `nexub` is the lowest layer. Every app style beats it without `!important`, whether unlayered, in the app's own Tailwind layers or in any later layer. This is what the 11.x comment in `styles.css` promises, but it only holds for unlayered CSS today.

**Measured in 11.9** (`packages/react/visual/layers.spec.ts`, the same result in Chromium, WebKit and Firefox):

- **Plain `styles.css` today:** an app utility or base rule ties with Nexub's, and whichever file loads last wins.
- **The layered file loaded first:** app utilities, app base rules and unlayered rules all win.
- **The layered file loaded after the app's layers:** `nexub` ranks above them and Nexub wins; only unlayered CSS still beats it.
- **An app that declares `@layer nexub;` at the top of its CSS:** the app wins whatever the order. The guide tells apps without Tailwind to do this.
- **A Tailwind v4 app** declares `@layer theme, base, nexub, components, utilities;` instead. With `nexub` first, Tailwind's preflight (`base`) would rank above it and its element resets would undo Nexub's component and diagram styles. In this order app utilities still win and preflight can't undo Nexub. Measured in `layers.spec.ts`, the same in Chromium, WebKit and Firefox. *Approved by the owner on 2026-11-25.* The contrast and axe suites also pass on a Storybook built with the layered file (1,148 passed).
- **Other stylesheets:** `@nexub/patterns`, `@nexub/marketing` and `@nexub/diagram` ship their own `styles.css` with the generic layer names. 12.0 moves them under `nexub` too, so one `@layer nexub;` covers every package.

- **Opt-in first:** 11.9 ships `@nexub/react/styles.nexub-layer.css`, the 12.0 file, so apps can switch and check before the major.
- **The `@nexub/themes/*` files** are already imported `layer(base)` by the app (the docs snippet). They are unchanged.

### 3. The Tailwind v3 compatibility defaults (decided: option a)

The v3 compatibility defaults (`tailwind-v3-compat.css`) can either stay or go in 12.0. Options for the maintainers:

- **(a) Keep them in 12.0, deprecate them, remove them in 13.0.** This keeps decision 2's timing and moves the deprecation onto the thing that actually exists. *Chosen by the owner on 2026-11-25.*
- **(b) Remove them in 12.0.** This breaks the deprecation policy: nothing in an 11.x minor deprecated them.

### Promotions

27 `beta` components move to `stable`: every one that meets the GOVERNANCE.md rule (used in production by at least 2 products). The roadmap's target was at least 30; the owner chose on 2026-11-25 to promote only what meets the rule rather than pad the list.

- **How they're chosen:** `nexub-usage` run on 2026-11-25 over the default branches of `nexub-platform` (17 apps, each a product) and `nexub-website-v2`. `matchub` is still in development and doesn't count. Apps that render a component through the platform's `@nexub/admin-ui` wrappers (for example `ListPage` → `ActionBar`, `MoneyField` → `MoneyInput`) count as users.
- **No API change:** a promotion only changes the docs badge and `accessibility.json`. None of the 27 has an open accessibility issue.
- **Stepper** is promoted in 12.0 even though 12.0 removes `current={-1}`; the owner accepted that.
- **List** (products using it in brackets):
  - `@nexub/react` (24): KpiTile (14), MultiSelect (13), BarChart (11), MoneyInput (11), SavedViews (11), Stepper (10), DonutChart (10), ActionBar (10), Sortable (9), PromptInput (9), RadioCard (7), MessageBubble (7), ThinkingIndicator (7), LineChart (5), DateTimePicker (5), SplitButton (4), Kanban (4), EventCalendar (4), TimePicker (4), Funnel (3), TreeView (3), CheckboxCard (2), Gauge (2), Heatmap (2).
  - `@nexub/patterns` (3): ErrorSummary (10), Conversation (3), ListDetail (2).
- **Not promoted:** 11 beta components are used by one product (mostly marketing blocks on the website) and 31 by none. They stay `beta`.

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

1. The v3 compatibility defaults: (a) or (b) above. **Answered: (a).**
2. The promotion list: which `nexub-usage` reports to use. **Answered: the 27 under Promotions.**
3. Correct decision 2 in `ROADMAP_12.x.md` to say that the preset has been gone since 4.0. **Answered: yes** (done).
4. The Tailwind v4 layer order (`@layer theme, base, nexub, components, utilities;`). **Answered: yes.**
