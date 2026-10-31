# Governance

How changes to Nexub DS are proposed and decided, what a component's status promises, and how things are deprecated and removed. Versioning mechanics live in [PUBLISHING.md](./PUBLISHING.md); day-to-day setup and the PR checklist live in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Who decides

- **Maintainers** own the system: the people listed in [`.github/CODEOWNERS`](./.github/CODEOWNERS). They review and merge PRs, accept or decline RFCs, and promote or deprecate components.
- **Contributors** are anyone opening an issue or PR, including product teams (Leap, Bookub, Payub, Founderub) and AI agents working on their behalf.
- **Consuming products** are the evidence for promotion: a component reaches `beta` and `stable` by being used in real products, not by age.

Decisions are made in the open, on the RFC issue or the PR. Maintainers aim for consensus with the people who raised concerns. If it can't be reached, the code owner of the affected area decides, and writes down why on the issue. An unresolved accessibility problem blocks a merge no matter who approves it.

## Proposing a change

Most changes need only a PR with a changeset: bug fixes, new props on an existing component, docs, tests, internal refactors, new variants that follow an existing pattern.

### When an RFC is required

Write an RFC before you write the code when the change:

- adds a **new component** (web or native) or a new pattern or page template;
- adds a **new package**;
- is a **breaking change** to a `beta` or `stable` API (renamed or removed export or prop, changed default, changed DOM or accessibility contract, raised peer dependency);
- adds a **new token category** (a new kind of token, not a new value in an existing scale), or changes what an existing role means.

If you aren't sure, open the RFC: a short one that gets a quick "no RFC needed" costs less than a PR that gets redesigned in review.

### Process

1. Open a GitHub issue titled `RFC: <short name>` using the template below.
2. Leave it open for comments for at least **3 working days**. Tag the products you expect to use it.
3. A maintainer records the decision on the issue: **accepted**, **accepted with changes** (listed), or **declined** (with the reason), and closes the issue.
4. Implementation PRs link the RFC. New components and packages start at `alpha` (see below).

### RFC template

```markdown
## Problem
What users or products can't do today, with a real example. Link the screens.

## Proposal
What we add or change, in a few sentences. Where it lives (package, path).

## API
Props/exports with types and defaults, and a usage snippet. Name things the way
existing components do (tone, size, variant, onXChange).

## Accessibility
Roles, keyboard map, focus management, screen-reader announcements, contrast,
touch targets (24px web / 44pt native), reduced motion.

## Web + native parity
The web component and its @nexub/react-native twin: same prop names and tokens?
Where do they differ, and why? If there is no twin, say why (web-only or
mobile-only), and what to use on the other platform.

## Alternatives
What else we considered, including "compose existing components" and "do nothing".

## Migration
Who is affected and what they change. For breaking changes: the deprecation
path, the one-line migration and whether `nexub-migrate` can automate it.
```

## Status lifecycle

Every component and pattern has a status: **`alpha` → `beta` → `stable` → `deprecated`**. The docs show it as a badge on each page. It tells consumers how much the API can still move.

| Status | What it promises | Breaking changes |
| --- | --- | --- |
| `alpha` | Exported and usable, but the API is still being shaped. | Allowed in any minor. The changeset still says what changed. |
| `beta` | The API is believed right; real usage is confirming it. | Allowed in a minor, marked `**Breaking:**` with the migration. Prefer a deprecation. |
| `stable` | Safe to build on. | Only through the [deprecation policy](#deprecation-policy). |
| `deprecated` | Still works, unchanged, until the removal major. Don't use it in new code. | Removed in the next major only. |

### Promotion criteria

A promotion is a PR that changes the status and lists the evidence for each item below in its description. A maintainer approves it.

**→ `alpha`** (entry)
- Accepted RFC, or a phase of an accepted plan (for example [MOBILE_PLAN.md](./MOBILE_PLAN.md)).
- Exported from its package with types, a story, and at least smoke tests.
- A docs registry entry, so the page exists with its Alpha badge.

**`alpha` → `beta`**
- **Docs:** usage (when to use / when not to), examples, props, and an accessibility section.
- **Tests:** unit tests for behaviour and keyboard interaction; the story passes the axe check; visual baselines recorded.
- **Accessibility review:** keyboard, screen reader (VoiceOver and one of NVDA or TalkBack), contrast in light and dark, reduced motion. Findings fixed or tracked as issues.
- **Used in one product**, in a real screen (behind a flag is fine).
- **Parity decided:** a native twin exists, or the page says why there isn't one.

**`beta` → `stable`**
- **Used in production by at least 2 products.**
- **No breaking change for at least 1 minor release** while in beta.
- No open accessibility bugs that block a task.
- Within its bundle-size budget ([`size-budgets.json`](./size-budgets.json)).

**→ `deprecated`**
- A replacement exists and is `beta` or `stable`, or the use case is being dropped on purpose (say so in the changeset).
- Follow the deprecation policy below.

### Where status lives

- Web components and patterns: `status` in the docs registry entry, `apps/docs/src/registry/components/<slug>.ts` or `apps/docs/src/registry/patterns/<slug>.ts`. Deprecated entries also set `deprecation: { replacement, removeIn, migration }`; `apps/docs/test/status.test.ts` checks it against the `@deprecated` JSDoc.
- React Native: every `@nexub/react-native` component is `alpha` (`NATIVE_STATUS` in `apps/docs/src/registry/native.ts`). Promote one by setting `status` on its entry there.
- `pnpm ai-docs` carries the status into the Claude skill, `@nexub/mcp` and `llms.txt`, so AI tools see the same thing.

## Deprecation policy

Deprecate in a minor; remove only in the next major.

1. **Deprecate in a minor.** In the same PR:
   - `@deprecated` JSDoc on the export that names the replacement and the removal major: ``@deprecated Use `Alert` instead: … Deprecated since 2.4.0; removal planned in 3.0.``
   - A **console warning in development**, once per session, guarded so it never runs in production builds (`process.env.NODE_ENV !== 'production'`). It names the replacement.
   - A **docs badge and notice**: `status: 'deprecated'` and `deprecation` in the registry entry. The page then shows the Deprecated badge and "Deprecated — removal planned in N.0" with the replacement and migration.
   - A **migration note**: the changeset line starts with `**Deprecated:**` and gives the one-line migration; longer migrations go in the Upgrading guide (`apps/docs/src/app/(docs)/getting-started/upgrading`). Add a `nexub-migrate` rule when the change is mechanical.
2. **Keep it working.** A deprecated API keeps its behaviour and tests until it is removed. Bug fixes are fine; new features go to the replacement.
3. **Remove only in the next major,** which is the rollover release after `x.9` (see [PUBLISHING.md → Versioning Policy](./PUBLISHING.md#versioning-policy)), with at least one minor release between the deprecation and the removal. If the deprecation lands in the last minor before a rollover, removal waits for the major after. The removal changeset starts with `**Breaking:**`.

Banner, Callout, Tag and StatusPill were deprecated in 1.1.0, before this policy. They have the JSDoc and the docs notice; their removal is planned in **3.0**, and their development warning must land in a 2.x minor before then.

## Versioning

All published packages (`@nexub/tokens`, `themes`, `icons`, `core`, `react`, `patterns`, `react-native`, `brand`, `mcp`) are one changesets **fixed group**: they always release together at the same version. The version is a **rolling minor**: every release bumps the minor, and `x.9` rolls over into `x+1.0.0`. Changesets are `minor` (any normal change) or `patch` (a hotfix to the current release), never `major`. See [PUBLISHING.md](./PUBLISHING.md) for the full policy and release process.

Status is separate from the version number. A package can be at 2.x while its components are `alpha` (as `@nexub/react-native` is): the status badge, not the version, says how stable an API is.
