# Docs site, platform previews and motion: findings and plan (2026-10-30)

Status: **approved 2026-10-30 (all recommendations); built and shipping in 2.2.0.** See §6.

Ask (Sasi, 2026-10-30):
1. Rebuild nexub.design on the Nexub design system itself. The React Native page, the usage guidelines and the site chrome don't match it.
2. Fix navigation. Some component and pattern links don't navigate, or are slow.
3. Every component and pattern shows **web and mobile** side by side, with the differences called out. Add web and mobile dashboards and page references.
4. Motion, on web and mobile.
5. Ship it all as **one release**.

---

## 1. Findings (measured on `development` at a05cbef)

### F1. Navigation: each page view fires about 180 requests, and every one runs the Cloudflare Function

I ran the static export locally and drove it with Playwright.

| Measure | Result |
|---|---|
| Requests from one page load (`/components/button`), within 8 s | **215**: 35 JS/CSS assets, **150 RSC `.txt` payloads**, **29 full-HTML fetches** |
| Cause | `DocsSidebar` calls `router.prefetch()` on **every** sidebar route at mount (`DocsSidebar.tsx:247`). Every `<Link>` also sets `prefetch={true}`. |
| Where those requests go on Cloudflare | `public/_routes.json` only excludes `/_next/*`, so all ~180 requests also run `functions/_middleware.ts` (the CSP nonce rewriter). |
| Click-to-render, run locally (150 ms latency per request added) | 180–500 ms. Nothing broke. |

So the code works. The failures happen at the hosting layer. The most likely cause:

- Each visitor costs about 180 Function invocations. The Workers free plan allows **100k requests a day**, which is about 550 page views.
- Once that runs out, Function requests fail. A failed RSC prefetch or navigation then hangs, or falls back to a full reload, which feels like "not navigating" or "takes time".
- Even under the quota, every request pays the Worker hop.

**To confirm (owner, 2 min):** Cloudflare → Workers & Pages → the docs project → Metrics. Look for "exceeded" or errors on Functions requests.

### F2. The docs site's own chrome isn't built on Nexub

- There are **547 inline `style={{…}}` blocks** across the docs app.
- Only 18 files import `@nexub/react`.
- Sidebar, TOC, search, props table, usage cards, variant matrix, loading skeletons and the React Native page are hand-written CSS plus inline styles.
- `DESIGN_REFRESH_PLAN.md` already lists "docs chrome still uses the old style" as not done.
- The usage guidelines ("When to use / not to use", Content pages) last changed on 20–21 Oct, before the Calm Depth, glass and mobile work.

### F3. Mobile is invisible in the docs

- Component pages show only `@nexub/react`. The registry `package` type doesn't even allow `@nexub/react-native`.
- The React Native page is prose and one table.
- Web "patterns" are 14 **component-level** blocks (StatCard, UserCard…). Native has 20 **full screens** (sign-in, activity, transaction detail, settings…). The two sets don't pair up.
- There's one web example (`/examples/dashboard`) and no mobile example.

### F4. Motion exists but is hard to see, and has gaps

| Already built | Gap |
|---|---|
| Spring tokens (spatial / effects / expressive) as CSS `linear()` and Reanimated configs | The docs previews are static, and the Motion page has 2 demos, so you can't *see* any of it |
| `nx-motion` enter/exit on 15 web overlays; `nx-press`, `nx-lift`, sheen; sliding Tabs indicator; NumberTicker | **Drawer** has no enter/exit. `Fade/Scale/Slide/Collapse` still use the old **duration** tokens, not springs. No list enter/exit or stagger. No skeleton → content crossfade. |
| `viewTransition` util + `view-transitions.css` in `@nexub/react` / themes | Not used by the docs site, so routes don't transition |
| Native: Pressable press spring, BottomSheet, swipe rows | Only **2** layout animations in the whole package. Lists, toasts, banners and chips appear instantly. No Amount ticker or shimmer. |

### F5. Previewing native on the web is cheap

- `@nexub/react-native` loads every native-only module behind an optional `require` (glass, haptics, screen capture, date picker).
- Its hard dependencies are Reanimated, SVG and safe-area, and all three support the web.
- The showcase app (`apps/mobile`, Expo Router) can be exported with `expo export --platform web`. That adds `react-native-web` + `react-dom`, but **no change to the Next.js build**.

---

## 2. Ideas (brainstorm, with my take)

| # | Idea | Take |
|---|---|---|
| I1 | **Platform toggle on every component and pattern page: Web · Mobile**, remembered per visitor | ✅ Core of the ask |
| I2 | **Live mobile preview in a phone frame**: the showcase app exported to web, served at `/m/…` and embedded per example | ✅ Interactive, and shows motion. One build for every component. |
| I3 | Real **iOS + Android screenshots** from Maestro beside the live frame (truth for native chrome, glass, switches) | ✅ Doubles as the Maestro baselines (pending item 6) |
| I4 | **"Differences" block** per component: props that differ, behaviour (sheet vs popover, native switch, haptics), what's web-only or mobile-only | ✅ Data in the registry, not prose |
| I5 | Theme, brand and dark mode in the docs also drive the phone frame (`postMessage`) | ✅ Small, high polish |
| I6 | **Page-level web templates** paired with native screens: Dashboard, Activity, Transaction detail, Settings, Sign-in, Checkout/pay, Chat, Paywall | ✅ Fixes the F3 mismatch |
| I7 | **Examples gallery**: Web dashboard and Mobile dashboard (Payub-style home) side by side, plus 3–4 more page references | ✅ |
| I8 | **Motion gallery**: every motion with a live demo, *Replay*, a **0.25× slow-mo** toggle, a reduced-motion toggle, and the spring curve drawn from the token | ✅ Makes motion visible |
| I9 | Route transitions on the docs site via View Transitions (sidebar stays put, content crossfades) | ✅ Uses our own util (dogfooding) |
| I10 | Usage guidelines as **visual Do / Don't cards** (a rendered right and wrong example), not text lists | ✅ Replaces the old usage grid |
| I11 | "Copy for AI" on each page (prompt + import, web or native) | Later, nice to have |
| I12 | Render native components *inside* Next.js with react-native-web | ❌ Couples the docs build to RN; the iframe (I2) gets the same result in isolation |
| I13 | Figma kit with matching web/mobile frames | ❌ Out of scope for this release |

---

## 3. Decisions needed

| # | Question | Recommendation |
|---|---|---|
| **Q1** | How to show mobile: live web export in a phone frame (I2), screenshots only (I3), or both? | **Both.** Live frame by default; an "iOS / Android screenshot" tab where the real platform look matters. |
| **Q2** | Ship the navigation fix now as a docs-only hotfix, or hold it for the single release? | **Hotfix now.** It's live breakage, and docs deploys don't publish npm packages. Everything else waits for 2.2.0. |
| **Q3** | Version | **2.2.0** (rolling minor; new motion APIs, no breaking changes) |
| **Q4** | Framing `/m/*` inside the docs needs `frame-ancestors 'self'` on those paths only. OK? | **Yes.** Same origin, and only on `/m/*`. The rest keeps `DENY`. |

---

## 4. Plan

One stream, then one release. Each PR goes feature → `development` once green; then `staging` → `production` → Version PR → npm → back-merge.

### Before we start
| # | Item | Owner |
|---|---|---|
| B1 | Merge **PR #151** (2.1.0 back-merge). Without it, `development` doesn't have 2.1.0. | Sasi, or me on your go |
| B2 | Rotate `NPM_TOKEN` (expires ~11 Nov), or set up trusted publishing | Sasi |
| B3 | Check the Cloudflare Functions metrics (F1) | Sasi |

### P1. Navigation fix (hotfix if Q2 = yes), about 1 day
| PR | Change |
|---|---|
| 1.1 | Remove prefetch-all on mount. Links use Next's default viewport + hover prefetch. Expanding a sidebar group prefetches only that group. |
| 1.2 | Keep the Function off non-HTML requests. Option A: `_routes.json` excludes RSC payloads, if Pages' wildcard matching allows (checked in the PR). Option B: the middleware calls `next()` straight away for non-HTML — this still counts as an invocation, so A is preferred. Long cache on the hashed `.txt`. |
| 1.3 | Playwright nav test in CI: 10 sidebar clicks, each lands within 1 s, and fewer than 40 requests per page view |

**Exit:** under 40 requests per page view; every sidebar link navigates in the test; on the live site, p95 click-to-content under 400 ms.

### P2. Docs shell on Nexub, about 1.5 weeks
| PR | Change |
|---|---|
| 2.1 | Layout: `AppShell` + `Sidebar` + `NavigationRail` (mobile) + `CommandPalette` search + TOC. Drop the custom CSS and inline styles from the chrome. |
| 2.2 | Page kit: `PageHeader`, `Tabs`, `Table` (props), `Callout`, `Code`, `Card`, `Skeleton`. Rebuild every Foundations, Content and Getting started page on it, including the React Native page. |
| 2.3 | Usage guidelines: visual Do / Don't cards (I10). Refresh copy for Calm Depth, glass and mobile. Update the Content pages (tone, vocabulary, grammar). |
| 2.4 | Route View Transitions (I9) + reduced-motion fallback |
| 2.5 | Lint guard: no `style={{` in `apps/docs/src` beyond an allowlist |

**Exit:** inline style blocks go from 547 to under 30 (only dynamic values); light, dark and every brand checked; axe clean; docs visual tests re-baselined.

### P3. Web and mobile previews, about 2 weeks
| PR | Change |
|---|---|
| 3.1 | `apps/mobile` web target: `react-native-web` + `react-dom`, `expo export -p web` into `apps/docs/out/m/`. Each example gets a deep route (`/m/c/button?ex=0&theme=dark&brand=payub`). **Spike first (1 day). Fallback: screenshots only.** |
| 3.2 | Registry v2: `native?: { name, examples, differences, platformNotes, status }`. The package type adds `@nexub/react-native`. Fill it for all ~30 twins and 18 mobile-only components. |
| 3.3 | Component page: **Web · Mobile** toggle (I1), phone frame (iPhone / Pixel), theme sync (I5), "Differences" table (I4). Mobile-only components get their own pages. |
| 3.4 | Maestro: one deep-linked screenshot per example on iOS + Android. Screenshots go into the docs (I3) and also act as committed baselines with `assertScreenshot`. |

**Exit:** every component with a twin shows both platforms; mobile-only components are listed; Maestro baselines are green on both OSes.

### P4. Patterns and examples, about 1.5–2 weeks
| PR | Change |
|---|---|
| 4.1 | Web page templates in `@nexub/patterns` to pair with the native screens: Activity, Transaction detail, Settings, Sign-in, Checkout/pay, Chat, Paywall (I6) |
| 4.2 | Native **Home/Dashboard** screen pattern (Payub-style: balance, quick actions, activity, insights) |
| 4.3 | Patterns pages: Web · Mobile toggle, side-by-side at desktop width; component-level blocks move under "Blocks" |
| 4.4 | Examples gallery (I7): Web dashboard ↔ Mobile dashboard, plus Settings, Sign-in and Transaction detail as full-page references |

**Exit:** each pattern has a web and a mobile version (or says "web only" / "mobile only" with the reason); 2 dashboards + 3 page references live.

### P5. Motion, about 1.5 weeks
| PR | Change |
|---|---|
| 5.1 | Web: `Fade/Scale/Slide/Collapse` on spring tokens; Drawer/Sheet enter/exit; `nx-stagger` for list and grid entrances; skeleton → content crossfade; `ListTransition` for item add/remove |
| 5.2 | Native: Reanimated `entering`/`exiting`/`layout` presets built from our springs (`nxEnter`, `nxExit`, `nxLayout`); applied to Toast, Banner, ListItem insert/remove, swipe-delete collapse, Chip, SegmentedControl indicator, `Amount` ticker, Skeleton shimmer. Every preset respects Reduce Motion. |
| 5.3 | Docs Motion gallery (I8): live web demos + phone frame, Replay, 0.25× slow-mo, reduced-motion toggle, curve plot from tokens. Also a "Motion" section on each component page that animates. |
| 5.4 | Tests: reduced-motion snapshot (no travel, crossfade only); token ↔ preset parity on native |

**Exit:** every overlay, list and feedback component animates on both platforms; reduce motion verified on iOS, Android and the browser; Motion page shows every preset.

### P6. Release 2.2.0, about 2 days
Changesets → `development` → `staging` → `production` → Version PR → npm → back-merge, then docs deploy.

**Checklist:** `ci:local` + visual green; Maestro iOS + Android green; nav test green on the deployed preview; Lighthouse ≥ 95 performance / 100 accessibility on 5 sample pages; manual check on a real iPhone and Android phone.

### Order and effort
`B1 → P1 (hotfix) → P2 → P3 → P4 → P5 → P6`. P5.2 (native motion) can run beside P3.
**Total: about 7–8 weeks for one focused stream.**

---

## 5. Risks
| Risk | Mitigation |
|---|---|
| RN-web output differs from real iOS/Android (native switch, glass, fonts) | Label the frame "interactive preview", with real screenshots one tab away (Q1) |
| The Expo web export adds build time and size to the docs deploy | Built once, cached by turbo; served from `/m/` as static files; lazy-loaded iframe |
| Rebuilding the docs shell regresses SEO or links | Keep every URL; redirect test over the sitemap |
| Motion overuse | One spring family per purpose (tokens), exit faster than enter, reduce motion designed in, reviewed on the gallery page |
| Cloudflare quota is not the real cause of F1 | P1 cuts requests by ~5× whatever the cause; the nav test proves the client side |

---

## 6. Results (2026-10-30)

| Phase | Delivered | Where |
|---|---|---|
| P1 | Prefetch on intent (`DocsLink`), `/*.txt` kept off the Pages Function, nav test. One page view: 215 → 34 requests (4 non-asset). | Hotfix #153 → production (live) |
| P2 | Docs shell on `Sidebar` + `Collapsible` + `Drawer`, `TopNav`, `SegmentedControl`, `CommandPalette`; page kit (`PageIntro`, `Section`, `DocTable`, `Guidance`, `Note`, `CardGrid`, `PageSkeleton`); every page rebuilt; inline styles 547 → 41 (all computed values), guarded by `test/inline-styles.test.ts`. | 2.2.0 |
| P3 | Web · iOS & Android switch on component and pattern pages; live `@nexub/react-native` previews (Expo web export at `/m`) in an iPhone/Pixel frame that follows theme and brand; differences tables; native props generated from source (`scripts/native-props.mjs`, CI check); 19 mobile-only pages; preview slugs typed against the mobile manifest. | 2.2.0 |
| P4 | 8 page templates in `@nexub/patterns` paired with native screens, native `HomeScreen`, `/patterns/pages/*` with a browser frame at real widths, `/examples` with web and mobile dashboards. | 2.2.0 |
| P5 | Web: springs for Fade/Slide/Scale/Collapse, Drawer motion, `nx-stagger`, `ListTransition`, `SkeletonSwap`, `usePrefersReducedMotion`. Native: `nxEnter`/`nxExit`/`nxLayout`/`nxSpring`, applied to Toast, Banner, list rows, swipe, Chip, SegmentedControl, Skeleton, `Amount animate`. Docs Motion gallery with curves from tokens, replay, slow motion and a reduced-motion preview. | 2.2.0 |

Decisions while building:
- **Q1:** live frames ship now. Per-example iOS/Android screenshots are captured by the new Maestro preview flow as CI artifacts; committing them as docs images and baselines is a follow-up.
- `/frame/*` (page templates) is framed like `/m/*`: same origin only, via `_headers` and the middleware.
- Docs screenshots mask live frames (`[data-live-preview]`) and wait for network idle; stable over six runs in the CI image.

Follow-ups: Maestro screenshot baselines; native `SkeletonSwap` twin; `Amount animate` by default once it can live inside text.
