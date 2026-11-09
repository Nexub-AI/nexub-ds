# Roadmap 7.1 → 8.0

Drafted 2026-11-08, as 7.0.0 reached npm (2026-11-08). S1, S5 and M1 shipped early as 7.0.1 (#434). Follows [ROADMAP_6.x.md](ROADMAP_6.x.md): one release per version, rolling-minor (7.9 rolls over to 8.0), development → staging → production → npm, each version on npm before the next starts.

**Direction.** 5.x and 6.x added components. 7.x adds almost none. It hardens what we have, makes it feel smoother, and gives existing components the depth people expect from Linear, Stripe, Vercel or Radix Themes. It also gives Nexub a look of its own, so it stops reading as Material 3. Same ground rules: WCAG AA, tokens only, native platform before JavaScript, new behaviour opt-in in a 7.x minor and default only in 8.0. The one new rule: **no new components unless a gap can't be closed by deepening an existing one.**

## Evidence (checked against `development` @ 6.8.0, 2026-11-08)

### Security

| # | Finding | Evidence |
|---|---|---|
| S1 | **High.** A PR-triggered job hands `RELEASE_PAT` to scripts from the PR branch | `mobile.yml:149,221` (trigger `pull_request`), token in the clone URL at `apps/mobile/scripts/screenshot-gate.sh:42`. Anyone who can push a branch can read a PAT that pushes to protected branches |
| S2 | **High.** The release job mixes long-lived credentials with arbitrary build code | `release.yml:25-39`: PAT persisted in `.git/config`, OIDC `id-token`, `CLOUDFLARE_API_TOKEN` and `npx -y wrangler` (no lockfile) all in one job. No protected `environment:` |
| S3 | No SAST, Scorecard or SBOM | nothing in `.github/workflows/*` |
| S4 | Overlays break under a strict `style-src` | `scrollLock="class"` exists only on Drawer and CommandPalette. Dialog, AlertDialog, Select, DropdownMenu, Popover, ContextMenu and Combobox still inject Radix `<style>`. No nonce on `NexubProvider` |
| S5 | `PasswordInput` reveal leaks to spellcheck | `PasswordInput.tsx:46` switches to `type="text"` with no `spellCheck`/`autoCorrect`/`autoCapitalize` and no default `autoComplete`. RN already sets these |
| S6 | `safeUrl` is used only by Citation | raw consumer/LLM URLs in MediaCard, Avatar, Breadcrumb, and 5 patterns + 2 marketing components |
| S7 | Feedback endpoint's real controls live in a dashboard | rate limit and R2 lifecycle are WAF/dashboard rules (`FEEDBACK_SETUP.md`), no `Origin` check, permanent screenshot URLs |
| S8 | Smaller items | unvalidated `data-product` from localStorage (`ThemeProvider.tsx:298`), undocumented `auditConfig.ignoreGhsas`, docs CSP keeps `style-src 'unsafe-inline'`, no Trusted Types check, FileUpload checks are client-side only |

Already good (not re-planned): SHA-pinned actions, zizmor, OIDC publishing with a provenance check, install scripts blocked, `persist-credentials: false` outside release, nonce-based `strict-dynamic` CSP on docs, `ThemeScript` escaping, read-only MCP server, hardened feedback upload.

### Smoothness

| # | Finding | Evidence |
|---|---|---|
| M1 | **Bug.** Progress indeterminate never shows | `value = 0` default (`Progress.tsx:65`) makes `isIndeterminate` always false. The `progress-stripes` keyframes don't exist |
| M2 | Two motion token sets; about 19 raw transitions | legacy `tokens/motion.json` alongside the generated springs. Bare `transition-*` falls back to Tailwind's 150 ms ease (Link, Table, DataTable, TreeView, Rating, FileUpload…). Progress, Accordion and NavigationMenu hard-code durations |
| M3 | Height animations are measured in JS | Accordion, Collapsible and `Motion/Collapse` measure heights. `interpolate-size` and `@starting-style` are unused |
| M4 | Layout jumps | NavigationMenu viewport snaps between items. Tabs indicator animates `width`, is horizontal only, and panels swap with no transition |
| M5 | View transitions can snapshot stale state | `utils/viewTransition.ts` has no `flushSync`, and no component uses it |
| M6 | Reorder has no motion | Sortable/Kanban use native DnD: no FLIP, drop indicator or auto-scroll, and touch is weak |
| M7 | No React 19 concurrency | no `useOptimistic`, `useTransition`, `useDeferredValue`, `useFormStatus`. Button's spinner can flicker and its success label changes width |
| M8 | Heavy surfaces | DataTable rows aren't memoised. Combobox isn't virtualised. Thick glass (28px blur) still scales on enter. No `contain`/`content-visibility` |
| M9 | RN gestures on the JS thread | BottomSheet uses `PanResponder` and drops release velocity. RN Toast uses stock fades with no swipe |

### Depth (missing from existing components, verified in source)

| Component | Missing |
|---|---|
| Toast | `toast.promise`, `update(id)`, loading tone, tone icons, countdown bar, vertical/velocity swipe |
| Input / Select / Combobox | clearable, character count, loading suffix; Select search and item descriptions; Combobox loading slot and animated list height |
| Dialog | built-in close button, sticky header/footer with scroll shadows, nested stack, mobile sheet mode |
| Tabs | overflow scroll with edge fade, scroll active tab into view, vertical indicator, pill variant |
| Tooltip / IconButton | rich content, arrow, shortcut slot; IconButton loading and built-in tooltip |
| Badge / Avatar | dot, count with max ("99+") and count-change animation; Avatar status enum with an accessible label, image fade-in, error reset when `src` changes |
| DatePicker / Slider / Switch | typed date entry, presets, disabled-date matcher, month animation; Slider marks and value tooltip; Switch loading and thumb icons |
| Progress / Skeleton / EmptyState | segmented and circular progress; shimmer and `Skeleton.Text`; EmptyState sizes and an enter animation |
| FileUpload / CommandPalette | previews, paste-to-upload, animated list; palette pages, loading and recent items |
| DataTable | `loading` and `emptyState`, controlled/manual sort and pagination |

## The Material question

You're right: it reads as Material 3, and that came from the 2026-10-20 refresh. `DESIGN_REFRESH_PLAN.md` deliberately borrowed M3's structure, and we copied too much of its visible surface along with it. Looking at the visual baselines (Button gallery, AppShell, Switch, DataTable), the giveaways are:

1. **Lavender-tinted neutrals.** The surface is about `#f9f8fe` because the neutrals carry the hue-268 primary tint. That is the M3 "tonal surface" look.
2. **Capsules everywhere.** `--shape-control: full` puts pill buttons, pill text fields and a pill nav indicator at every size.
3. **Pastel tonal containers.** The tonal button, the nav active-indicator pill and the mint status badges.
4. **The M3 Switch.** An outlined track with a small grey thumb that grows when on.
5. **Google-adjacent blue** `#0059c8`, plus M3 component names (NavigationRail, ListDetail, SplitButton, "tonal").

**My take: keep the engine, change the face.** The parts that make M3 good are invisible: HCT tonal roles, contrast that's guaranteed by arithmetic, state layers, spring tokens and the density ladder. Users don't see those, and they're why our contrast tests pass for every seed. What people recognise as "Google" is the five things above, and all five are token-level choices. So the fix is a **Signature** style, opt-in in 7.9 and the default in 8.0:

- **Neutrals:** near-zero chroma (or a faint warm tint) instead of a primary-tinted lavender. Hierarchy comes from hairline borders and crisp, low elevation, in the Linear/Stripe/Vercel direction.
- **Shape ladder:** controls and fields at about 10px, cards at 16px, and full pills only where meaning calls for them (chips, tags, segmented, toggles). Concentric radii inside cards stay.
- **Accent:** lead with the Nexub brand hue and use the brand gradient for moments (primary CTA hover, focus glow, progress, celebrate), not a stock blue. `tonal` stays but uses neutral-tinted containers instead of pastel.
- **Controls:** an iOS-style full-thumb Switch; Checkbox/Radio with a spring check-draw; a filled-field style only for dense forms.
- **Type:** Plus Jakarta for display with tighter tracking, Inter with tabular numerals for data. Personality comes from type and motion, not colour washes.
- **Vibrancy through behaviour.** Count-up badges, a sheen on primary hover, toast progress, check-draws and shared-element transitions all come from 7.3–7.7 motion work. That's what makes it feel alive without going loud.

This reverses one approved decision, "capsule controls" (2026-10-20), so it needs your sign-off (decision 2).

## Versions

| Version | Theme | Headline |
|---|---|---|
| 7.1 | Lock down CI + fixes | **S1:** a record job with no secrets uploads PNGs, and a trusted `workflow_run` job (bot app or scoped `GITHUB_TOKEN`) commits baselines. **S2:** split release into build → publish (OIDC only) → docs deploy (CF token only) → version PR (PAT only), behind a protected `release` environment, with wrangler pinned in the lockfile. **S3:** CodeQL (JS/TS + Actions), OpenSSF Scorecard, CycloneDX SBOM attached to releases. Document or expire the ignored GHSA. Bugs: Progress indeterminate (M1), Avatar error reset |
| 7.2 | Secure by default (web) | `scrollLock="class"` on every modal overlay, and a `NexubProvider nonce` that calls `setNonce` (S4). PasswordInput defaults plus an `aria-pressed` reveal (S5). One shared `safeHref` across react, patterns and marketing, with tests (S6). `data-product` allowlist. Trusted Types report-only on docs to prove the library is TT-clean, and drop `'unsafe-inline'` from docs `style-src`. Feedback endpoint: WAF and R2 lifecycle as code, `Origin` allowlist, expiring screenshot URLs (S7). FileUpload `validate` hook. A docs **Security** page with a threat note per risky component |
| 7.3 | Motion 2 | One motion source: retire `motion.json`, add a DEFAULT transition token, a lint rule against raw `duration-*`/`ease-*`/bare `transition-*`, and `useMotion` reading from tokens (M2). `interpolate-size` + `@starting-style` for Accordion/Collapsible/Collapse, with the grid-rows trick as fallback (M3). NavigationMenu viewport resizes on the spatial spring. Tabs indicator on `transform`, vertical support and panel crossfade (M4). `viewTransition` with `flushSync` that returns its promise (M5). Containment on overlays and table cells. Glass surfaces fade instead of scaling (M8) |
| 7.4 | Feedback & loading | Button: `useFormStatus`-aware, a 150 ms spinner delay with a minimum duration, stable width. `useAsyncAction` / `useOptimistic` recipe. Toast: `promise`, `update`, loading tone, tone icons, countdown bar, direction- and velocity-aware swipe. Skeleton shimmer and `Skeleton.Text`. DataTable `loading`/`emptyState`. Avatar fade-in and status enum. Progress segmented and circular |
| 7.5 | Rich inputs | Input clearable, character count, loading suffix. Select search, clearable, item descriptions. Combobox loading slot, virtualised option (reusing the 5.4 optional peer), animated list height. DatePicker typed entry, presets, disabled-date matcher, month transition. Slider marks and value tooltip. Switch loading and thumb icons. FileUpload previews, paste-to-upload, animated list |
| 7.6 | Rich surfaces & navigation | Dialog close button, sticky header/footer with scroll shadows, nested stack, `sheet` on small screens. Tabs overflow, scroll-into-view, pill variant. Tooltip rich content, arrow, shortcut slot. IconButton loading and built-in tooltip. Badge dot, count/max and count animation. CommandPalette pages, loading, recents. EmptyState sizes and enter |
| 7.7 | Reorder & data at scale | Pointer-based drag for Sortable/Kanban (keeps the 6.5 no-dnd-kit decision): FLIP settle on the spatial spring, drop indicator, edge auto-scroll, reliable touch; keyboard flow unchanged (M6). DataTable memoised rows, controlled/manual sort and pagination, features split to cut the 18.6K budget. `useDeferredValue` in FilterBar/FilterBuilder (M7, M8). Perf proof: INP and frame-time budgets in CI for DataTable, Combobox and Kanban |
| 7.8 | Native smoothness | BottomSheet and Toast on gesture-handler worklets with release velocity carried into springs, and spring close with a completion callback instead of `setTimeout` (M9). nx presets and swipe on the RN Toast. Port the 7.4–7.6 props that make sense on native |
| 7.9 | Signature + 8.0 RC | `data-style="signature"` opt-in (see "The Material question") across web and RN tokens, with visual baselines for both styles. Feature freeze, deprecations, `nexub-migrate` rules, Migrating to 8.0 |
| 8.0 | New defaults | Signature becomes the default and the M3 look remains as `data-style="classic"`. Secure defaults flip: `scrollLock="class"` and strict `safeHref` on. Legacy motion tokens and 7.x deprecations removed |

## Why this order

- **Security first.** S1 is a live credential exposure, and the CI split doesn't touch component code, so it ships cleanly.
- **Motion 2 before depth.** Every rich state in 7.4–7.6 animates on the unified tokens, so the work isn't done twice.
- **Depth before the look.** Signature re-baselines every story once, after the components stop changing.
- **RN after web**, as in 5.x and 6.x.
- **8.0 flips defaults only**: no surprise features in a major.

## Decisions (open)

1. **Patch S1 + S5 + M1 now, as 7.0.1**, instead of waiting for 7.1? Recommended: yes. S1 is exploitable today by anyone with push access.
2. **Signature look.** It reverses the approved "capsule controls" decision. Recommended: keep the M3 engine (HCT roles, state layers, springs) and replace the five visible signatures, opt-in in 7.9 and default in 8.0. Alternative: a lighter tweak in 7.x (neutral surfaces + 10px fields only), with no default change.
3. **`classic` lifetime.** Keep it through 8.x as a supported style, or deprecate it in 8.x and remove it in 9.0.

## Out of scope

New components, Tailwind v4 / prebuilt CSS (R4, a separate track), rich text editor, form builder.

## Still blocked (unchanged)

Figma Code Connect, native promotion to stable (Payub pilot), Expo Go QR (EAS project), recorded screen-reader sessions, docs version switcher. npm trusted-publisher registration per package (E5) still needs owner action on npmjs.com.
