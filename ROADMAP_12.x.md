# Roadmap 11.7 → 12.7 — depth after breadth

Drafted 2026-11-22. Follows [ROADMAP_11.x.md](ROADMAP_11.x.md). 11 releases: three 11.x minors, the 12.0 major, then seven 12.x minors. *12.2 was inserted by the owner on 2026-11-27 for the nexub-platform requests; the planned 12.2–12.6 each moved down one number.* **Approved by the owner on 2026-11-22**, with the suggested answer to every decision (see "Decisions" at the end). Development starts with 11.7.

**Why it starts at 11.7.** 11.6.0 (2026-11-22) closed the last of the 38 platform gaps and shipped `@nexub/diagram` and `@nexub/elements` at `alpha`. The 11.x plan is finished.

**Shipped.** 11.7.0 (2026-11-24, on `latest`): the quiet release. Its 48-hour soak was removed by the owner the same day; each version now ships on its own once green. 11.8.0 (2026-11-24, on `latest`): native fields. 11.9.0 (2026-11-24, on `latest`): three more elements, the automated screen-reader pass, the opt-in layer file and RFC 12.0. 12.0.0 (2026-11-27, on `latest`): the clean break, RFC 12.0 accepted with changes on 2026-11-26. 12.1.0 (2026-11-27, on `latest`): performance (lean CSS, windowed option lists, React Compiler in CI, the INP gate). 12.2.0 (2026-11-27, on `latest`): the nexub-platform requests (chat, menus and charts). 12.3.0 (2026-11-28, on `latest`): motion presets and haptics, the illustration system, chart storytelling and the `@nexub/genui` RFC.

**Direction.** 10.x made the library look better. 11.x closed the gaps the apps worked around. 12.x is about depth: fewer new parts, more of what exists made stable, fast, native and measurable.

- **11.7 — Quiet release: nothing flaky**
- **11.8 — Native catch-up I: fields**
- **11.9 — Alpha → beta, and the 12.0 RFC**
- **12.0 — The clean break**
- **12.1 — Performance**
- **12.2 — Platform requests: chat, menus and charts**
- **12.3 — Signature moments**
- **12.4 — AI-native UI 2.0**
- **12.5 — Native catch-up II: screens**
- **12.6 — Theming studio and tokens**
- **12.7 — Adoption and proof**

## How this plan was made

A read-only pass over `development` (plus this branch's 2 unmerged CLS commits) on 2026-11-22: package folders, the generated docs registry (`parity.generated.json`, component status badges), `size-budgets.json`, `lighthouserc.json`, `@deprecated` tags, the open follow-ups left by 11.6, and every earlier plan's "later" list ([REVIEW_WORK_ITEMS.md](REVIEW_WORK_ITEMS.md) R3, R6).

Limits. The counts come from folder names and generated JSON, not from a running app. Some web components have no native twin because they are web-only by nature (Kbd, ScrollArea, Menubar, ResizablePanels), so the real native gap is smaller than the raw count. **Each version starts by re-measuring its own numbers on current `development`.** Items that are inferred, not measured, are marked *(check)*.

## Where things stand after 11.6

| Area | Measured |
|---|---|
| Packages | 12, in lockstep at 11.6.0 |
| Web | 148 React component folders, 42 patterns and templates, 244 test files, 189 stories |
| Maturity (docs badges) | 99 `stable`, 69 `beta`, 29 `alpha`, 1 `deprecated` |
| Native parity | 51 web components have a mapped native twin. About 111 have none. The 51 twins are still missing 283 web-only props. Templates are web only |
| Performance gates | Lighthouse runs with the **desktop** preset only, on 5 docs pages. No INP measurement. Budgets: `react` 286.6 kB, `react/styles.css` 43.8 kB, `react-native` 80 kB, `react-native/patterns` 61.4 kB |
| Alpha packages | `@nexub/diagram`, `@nexub/elements` (2 controls: date picker, number input) |
| Never built | Usage telemetry across the 14 apps (R6). Token tiers (R3) only partly done *(check)* |
| Deprecations | One tagged: `Stepper current={-1}`, removal planned for 12.0 |

### Pace: the finding that leads the plan

11.1 to 11.6 shipped in 2 days, with about 1,050 commits in November. The pace held, but each step had a flake that cleared only on a rerun: the docs CLS check on picker pages (failed twice in a row on the 11.6 merge), the DataTableVirtual heap check, and the reproducible-build check on the patterns tarball. A rerun that passes hides a real fault. 12.x slows the release step down, not the development: see the **Release rules** below.

### Open follow-ups carried from 11.6

- Picker-page CLS flake (time-picker, date-time-picker). Partly fixed on `fix/picker-docs-cls`.
- React PeriodPicker month labels.
- WebKit dark-theme text colour.
- Screen-reader pass before `@nexub/diagram` and `@nexub/elements` leave alpha.
- Diagram and elements strings live in their own files, not in `@nexub/core` messages.
- PageFrame default strings for every template (about 2 kB per page).
- 61 stale tracked md copies in `apps/docs/public`.
- Dependabot PR #656 needs a rebase.

## The plan

| Version | Theme | Size |
|---|---|---|
| **11.7** | Quiet release: nothing flaky | M |
| **11.8** | Native catch-up I: fields | L |
| **11.9** | Alpha → beta, and the 12.0 RFC (RC on `next`) | L |
| **12.0** | The clean break | XL |
| **12.1** | Performance | L |
| **12.2** | Platform requests: chat, menus and charts | L |
| **12.3** | Signature moments (+ RFC for `@nexub/genui`) | L |
| **12.4** | AI-native UI 2.0 | L |
| **12.5** | Native catch-up II: screens | XL |
| **12.6** | Theming studio and tokens | L |
| **12.7** | Adoption and proof | M |

### 11.7 — Quiet release: nothing flaky

No new components. Every later version depends on a CI you can trust.

- **Flakes fixed at the cause.** Picker-page CLS (land `fix/picker-docs-cls`, then prove it with 20 back-to-back runs). DataTableVirtual heap check. Any check that failed and then passed on rerun in 11.x gets an issue and a root cause.
- **Flake rule.** A check that passes only on rerun opens an issue automatically and blocks the next release until the issue is closed or waived by the owner.
- **Release routine.** Add the 48-hour soak (removed by the owner on 2026-11-24) and the flake rule to the release routine in [PUBLISHING.md](PUBLISHING.md), so every 12.x release follows them.
- **Follow-ups.** PeriodPicker month labels. WebKit dark text colour. Move diagram and elements strings into `@nexub/core` messages (one `NexubMessages` source for every package). Load PageFrame default strings per template, not for all templates. Delete the 61 stale md copies and add a check so they cannot come back. Rebase or replace #656.
- **Performance gates.** Add a **mobile** Lighthouse preset (throttled CPU and network) beside desktop, on the same pages plus one template page. Record INP and LCP so 12.1 has a baseline. Warn, don't fail, in 11.7.

### 11.8 — Native catch-up I: fields

The fields that 11.1–11.5 fixed on web are the ones mobile apps need most.

- **Native essentials list.** Native targets an essentials list of about 80 components, not full parity *(decision 3)*. 11.8 publishes the list in the docs, chosen from the mobile apps' screens; from 12.7 the usage scanner keeps it current. Parts outside the list show their web alternative, as BottomSheet does today.
- **Port to `@nexub/react-native`:** ComboboxField (with async search), nullable NumberInput (11.1 rules: empty state, clamp on blur), CurrencySelect and MoneyInput currency slot, DatePicker `granularity="month" | "year"`, FileUpload with camera capture and `transform`, `usePrompt()`, OTPInput `mode="backup"`, SwitchField / CheckboxField / CheckboxGroupField.
- **Shared rules in `@nexub/core`.** Where web and native share logic (number parsing, phone parsing, date granularity), it lives in core once.
- **Parity target.** Cut the 283 missing props on the 51 twins by at least half, and list the rest in the release notes as parity gaps (the existing 11.x rule).
- Mobile (Maestro) runs on every PR in this version.

### 11.9 — Alpha → beta, and the 12.0 RFC

- **Screen-reader pass** (VoiceOver on macOS and iOS, NVDA on Windows) on `@nexub/diagram` and `@nexub/elements`. Fix what it finds, then promote both packages to `beta`.
- **More elements.** `<nx-select>`, `<nx-combobox>` and `<nx-phone-input>`, form-associated like the first two, built on the same core logic as React. Reference: Forms respondent pages.
- **Open RFC 12.0** (new file `RFC_12.0.md`, raises `APPROVED_MAJOR` to 12). It lists every removal and default change for 12.0 and its `nexub-migrate` rule. Comment period as in [GOVERNANCE.md](GOVERNANCE.md).
- **12.0 RC** published on `next` once the RFC is accepted, as 10.9 was for 11.0.

### 12.0 — The clean break

A major is the only chance to change defaults, so it carries removals and promotions, not new features.

- **Removals.** `Stepper current={-1}` (deprecated 11.4), plus anything else the RFC lists. Each one has a `nexub-migrate` rule and a line in the Upgrading guide.
- **Default changes, each subject to the RFC:**
  - CSS cascade layers (`@layer nexub`), so app styles win without `!important`.
  - Tailwind v4 as the one supported path. The v3 preset has been gone since 4.0; what remains is the v3 compatibility defaults in `styles.css`, which 12.0 keeps and deprecates and 13.0 removes *(decision 2, corrected 2026-11-25)*.
  - The component token tier on by default (see 12.6).
- **Promotions.** At least 30 `beta` components to `stable`, chosen by usage in the platform apps (the [GOVERNANCE.md](GOVERNANCE.md) rule: promotion comes from real use, not age). *RFC 12.0 (2026-11-25): 27 meet the rule, and the owner chose to promote those 27.*

### 12.1 — Performance

Uses the 11.7 baseline and the 12.0 layering decision.

- **CSS.** Split `react/styles.css` per component, or ship it in cascade layers that apps can import in parts. Target: a typical app page loads under half of today's 43.8 kB.
- **Large lists.** Virtualize Combobox, MultiSelect, TreeView and CommandList options above a threshold.
- **React Compiler.** Confirm every component works with it, and add a test build with it on.
- **Native.** Cut the `react-native` and `react-native/patterns` bundles; lazy-load heavy parts (charts, QR, calendar).
- **Gates.** Mobile Lighthouse performance ≥ 0.90 becomes blocking. INP under 200 ms on the 3 heaviest template pages. *Changed by the owner on 2026-11-27:* "every size budget at least 10% lower than at 11.6" is a 12.x target, met by 12.6, which is 12.7 after the 12.2 insertion (see How each version is judged). At 12.1, 23 of 241 budgets were 10% lower; `react` was flat and `react-native` 32% higher than at 11.6.

### 12.2 — Platform requests: chat, menus and charts

*Inserted by the owner on 2026-11-27, ahead of the planned 12.2 (now 12.3), so the platform gets these first.* Source: nexub-platform `docs/go-agents-design-system.md` and the owner's list of 2026-11-27. All additive, so a minor.

- **DropdownMenu.RadioItem** `indicator="start" | "end"` (default `start`): with `end`, the tick sits at the inline end, so a theme menu can show icons on the left.
- **Conversation** (`@nexub/patterns`): `relative` on the scroller (sr-only labels stay inside it); `DateSeparator` ("Today", "Yesterday", "25 Nov 2026"); "Jump to newest" when scrolled up and new messages arrive; a `thinking` slot for `ThinkingIndicator`, announced politely, that never moves the scroll.
- **MessageBubble:** `avatar` for `from="user"` at the inline end (the label stays "You said"); `collapse?: number | false` with Read more / Show less, a fade and `aria-expanded`, shown only when the content overflows; `MessageCard` (title, status, fields, body, actions, `done`); an inline `Highlight` for amounts, dates and statuses.
- **PromptInput:** slash `commands` with `onCommand(value, args)`, and a `chips` slot for quick replies.
- **Agent identity:** `AgentAvatar` and `AgentBadge`. They sit beside the 12.4 agent parts (tool-call cards, approval gate) and ship here first.
- **OrgChart:** zoom (pinch, buttons, keyboard) and stacking for wide teams, so People can drop its own chart.
- **EventCalendar:** a `color` per event on top of the tones, readable in both themes, with a contrast check.
- **AppShell.Main:** `relative`.
- **@nexub/brand:** app-icon tiles (dark and `-light`) for devX, partnerhub, book-hub and audit-hub.
- **Sidebar.Group:** collapsible (low priority).
- Each with stories, tests, the screen-reader check and size budgets, as every version.

### 12.3 — Signature moments

The creative layer: what makes a Nexub app recognisable without slowing anyone down. The 10.x rule stays: colour and motion on landmarks and moments, calm on working surfaces.

- **Motion language.** Named spring presets by intent (`enter`, `exit`, `emphasis`, `success`, `attention`) used by every component, documented as one page with live examples. Reduced motion respected everywhere.
- **Illustration system.** A small set of spot illustrations for empty, error, success and offline states, themed by tokens, light and dark, on web and native.
- **Haptics.** Native success, warning and selection haptics paired with the motion presets.
- **RFC for `@nexub/genui`.** Open the RFC for the 12.4 package, so its comment period runs in parallel with 12.3.
- **Charts that tell a story.** Annotations, a highlighted change ("up 12% since March"), and a reference line, without breaking the 10.3 rule that product accent stays out of charts.

### 12.4 — AI-native UI 2.0

- **Agent parts.** Tool-call cards (running, done, failed), an approval gate (approve / edit / reject before an action runs), a diff and review view, and streaming table and form states. Built on the existing AgentKit, PromptInput, Conversation and StreamingText.
- **Generative UI schema in a new `@nexub/genui` package, at `alpha`** *(decision 4)*. A versioned JSON schema an LLM can return and the DS renders safely: an allow-list of components and props, no raw HTML, validation before render. `@nexub/mcp` serves the schema and its docs to agents. New package, so it needs an RFC (opened in 12.3, like `@nexub/elements` in 11.3), a `dependency-policy.json` entry, a trusted-publisher placeholder on npm and its own size budget.
- XSS corpus tests extended to the schema renderer.

### 12.5 — Native catch-up II: screens

- **Templates on native.** Sign in, sign up, verify code, settings, dashboard, status pages: the 10.5 full-page states that are web only today.
- **Larger screens.** Tablet and foldable layouts for AppShell, ListDetail and NavigationRail.
- **Native twins** for Kanban (read-only and move), EventCalendar (day, agenda) and Chart.
- Move to the Expo SDK that is current when the version starts.

### 12.6 — Theming studio and tokens

- **Token tiers complete.** Reference → semantic → component, with the component tier documented per component (closes R3).
- **Brand builder in the docs.** Pick a seed colour, see contrast checked live, preview components, export tokens (CSS, Tailwind v4, native). Built on `@nexub/tokens/seed`.
- **APCA** contrast reported beside WCAG 2 in the contrast tests and the builder.
- **Design-tool sync.** Tokens exported in a format the design team's tool imports, so design and code read the same source *(check which tool the design team uses)*.

### 12.7 — Adoption and proof

- **Usage scanner** (closes R6). A script, run against the 14 platform apps, that counts DS component and prop use, local overrides, and copies of DS parts.
- **admin-ui tracker.** The stopgaps that 11.x made redundant, and whether each app has deleted them.
- **Health scorecard per app.** DS version, coverage, overrides, deprecated APIs in use. Published in the docs.
- **Codemods** for the top workarounds the scanner finds.
- The scanner's results feed the 13.x plan.

## Release rules for every version

- **Soak.** ~~A version stays on `staging` for at least 48 hours~~ *(decision 1, reversed by the owner on 2026-11-24)*: each version goes to `production` as soon as staging CI and Mobile are green with no open flake, one version per release. The flake rule stays.
- **No rerun-to-green.** A check that fails and then passes is a flake: it gets an issue, and the next release waits for it (11.7 rule).
- All 10.0 / 11.0 gates stay blocking. Baselines in light, dark, RTL and forced colours. Docs page with a playground and the new states on the same PR.
- Native: a new web prop is ported in the same version or listed as a parity gap in the release notes.
- 11.7–11.9 and 12.1–12.7 are minors: additive and opt-in, no default change. Only 12.0 breaks, and only for what RFC 12.0 lists.
- [PUBLISHING.md](PUBLISHING.md) release routine for each version.
- **Overrun rule.** A version ships its stability, accessibility and parity items on time. A creative or new-part item that is not ready moves to the next version instead of holding the release.

## How each version is judged

| Measure | After 11.6 | Target after 12.7 |
|---|---|---|
| Flaky checks cleared only by rerun | at least 3 in 11.x | 0 |
| Components `stable` / `beta` / `alpha` | 99 / 69 / 29 | 130+ stable, alpha only for parts under 6 months old |
| Web-only props on native twins | 283 | under 70 |
| Web components with a native twin | 51 | 80+ (web-only-by-nature parts excluded) |
| Native templates | 0 | 6 |
| Lighthouse | desktop only | mobile ≥ 0.90, blocking |
| `react/styles.css` loaded by a typical page | 43.8 kB budget | under half |
| Size budgets at least 10% below 11.6 *(12.x target, owner 2026-11-27)* | 0 of 241 | all of them, by 12.7 (was 12.6 before the 12.2 insertion) |
| Apps with a usage scan and health score | 0 | 14 |

## Why this order

- **Stability first.** Six minors in two days worked, but with flakes. Every later version needs a CI that tells the truth.
- **Native before the major.** Parity gaps are cheaper to close before 12.0 moves APIs.
- **12.0 is a clean-up.** It is the one chance to change defaults, so it carries only removals, default changes and promotions.
- **Performance after 12.0,** because cascade layers and the Tailwind decision decide how CSS can be split.
- **Creative and AI after the base is solid.** That is where the library stands apart, and it is safest on stable parts.
- **Measurement last,** so it shows what the whole run achieved and drives 13.x.

## Decisions

Answered by the owner on 2026-11-22, accepting every suggestion:

1. **Pace.** A 48-hour staging soak with no flakes before each production release. Development keeps going during the soak. *Changed by the owner on 2026-11-24: no soak; each version is released on its own as soon as it is green, with no open flake.*
2. **12.0 scope.** Cascade layers on by default in 12.0. The Tailwind v3 preset is frozen and deprecated in 12.0, and removed in 13.0. *Corrected by the owner on 2026-11-25 (RFC 12.0): the preset was removed in 4.0. The v3 compatibility defaults (`tailwind-v3-compat.css`) take its place: kept and deprecated in 12.0, removed in 13.0.*
3. **Native ambition.** A "native essentials" list of about 80 components, published in 11.8 from the mobile apps' screens and kept current by the 12.7 scanner. Not full parity.
4. **Generative UI (12.4).** Schema and renderer in a new `@nexub/genui` package at `alpha`, served by `@nexub/mcp`. RFC opened in 12.3.
5. **Order.** As listed. Performance stays at 12.1, after the 12.0 layering decision. If the platform reports slow pages before then, a fix ships as a patch, not by reordering the plan.

The plan as a whole was approved on 2026-11-22. 11.7 starts next.
