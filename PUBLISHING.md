# Nexub DS — Publishing Guide

This document is the canonical reference for releasing packages.
Update the [Release History](#release-history) table after every publish.

---

## Package Overview

| Package | npm | Purpose |
|---|---|---|
| `@nexub/tokens` | [![npm](https://img.shields.io/npm/v/@nexub/tokens)](https://www.npmjs.com/package/@nexub/tokens) | Design tokens (CSS vars + Tailwind preset) |
| `@nexub/themes` | [![npm](https://img.shields.io/npm/v/@nexub/themes)](https://www.npmjs.com/package/@nexub/themes) | CSS theme files (light, dark, 4 brands) |
| `@nexub/icons` | [![npm](https://img.shields.io/npm/v/@nexub/icons)](https://www.npmjs.com/package/@nexub/icons) | Tree-shakeable icon components |
| `@nexub/react` | [![npm](https://img.shields.io/npm/v/@nexub/react)](https://www.npmjs.com/package/@nexub/react) | 90+ React UI components |
| `@nexub/patterns` | [![npm](https://img.shields.io/npm/v/@nexub/patterns)](https://www.npmjs.com/package/@nexub/patterns) | Composite UI patterns |

All five packages are **linked** — they always publish at the same version number.
`@nexub/docs` is excluded from publishing (it's the docs website, not a library).

---

## Release History

| Version | Date | Type | Summary | Tag |
|---|---|---|---|---|
| `0.0.1` | — | Initial | Initial private release (pre-public, workspace only) | — |
| `0.0.2` | 2026-04-27 | Patch | Focus ring double-ring fix (Input, Textarea, Select, NumberInput, Heading); Toast SSR guard; Collapse RAF cleanup; FileUpload useMemo; useMergedRefs stable callback; Motion willChange hints | [v0.0.2](https://github.com/Nexub-AI/nexub-ds/releases/tag/v0.0.2) |

---

## Versioning Rules

We follow **Semantic Versioning** (`MAJOR.MINOR.PATCH`):

| Change | Version bump | Example |
|---|---|---|
| Bug fix, internal refactor, performance, docs | `patch` | `0.0.2` → `0.0.3` |
| New component, new prop, backward-compatible feature | `minor` | `0.0.3` → `0.1.0` |
| Renamed/removed export, breaking prop change, peer dep bump | `major` | `0.1.0` → `1.0.0` |

All packages in the linked group always bump to the **same version** even if only one package changed.

---

## Full Release Process

### Step 1 — Write a changeset (AI or human)

```bash
# Interactive — prompts you to pick packages and bump type
npx changeset

# Or: write the file manually in .changeset/your-description.md
```

Changeset file format:
```markdown
---
"@nexub/react": patch
---

Short description of what changed and why.
```

**One changeset per logical change.** Multiple changesets accumulate and are consumed together when you run `changeset version`.

---

### Step 2 — Version bump (AI does this)

```bash
# Consumes all pending .changeset/*.md files,
# bumps package.json versions, writes CHANGELOG.md
npx changeset version
```

Then manually align any linked packages that were not bumped:
```bash
# All packages in the linked group must be at the same version
node -e "
  const fs = require('fs');
  const v = '0.0.X';  // ← target version
  ['tokens','themes','icons','patterns'].forEach(pkg => {
    const f = \`packages/\${pkg}/package.json\`;
    const j = JSON.parse(fs.readFileSync(f));
    j.version = v;
    fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
  });
"
```

---

### Step 3 — Build all packages (AI does this)

Must be done in dependency order to avoid DTS resolution errors:

```bash
npx pnpm --filter @nexub/tokens   build
npx pnpm --filter @nexub/icons    build
npx pnpm --filter @nexub/react    build
npx pnpm --filter @nexub/patterns build
# @nexub/themes has no build step (ships raw CSS from src/)
```

---

### Step 4 — Dry-run verify (AI does this)

```bash
for pkg in tokens themes icons react patterns; do
  echo "=== @nexub/$pkg ==="
  cd packages/$pkg && npm pack --dry-run && cd ../..
done
```

Check:
- [ ] Only `dist/` files listed (no `src/`, `node_modules/`, `*.test.*`)
- [ ] Package sizes are reasonable (react < 150 KB packed)
- [ ] Version number matches the intended release

---

### Step 5 — npm login (YOU do this)

```bash
npm login
# Enter: npm username → password → OTP (if 2FA enabled)
npm whoami   # confirm you're logged in
```

---

### Step 6 — Publish (YOU do this)

```bash
# From the repo root, publish all packages in order:
npx pnpm --filter @nexub/tokens   publish --access public --no-git-checks
npx pnpm --filter @nexub/themes   publish --access public --no-git-checks
npx pnpm --filter @nexub/icons    publish --access public --no-git-checks
npx pnpm --filter @nexub/react    publish --access public --no-git-checks
npx pnpm --filter @nexub/patterns publish --access public --no-git-checks
```

> `--access public` — required for scoped `@nexub/*` packages on npm.
> `--no-git-checks` — skips the "clean working tree" check (safe since we committed).

After publish, verify on npm:
```bash
npm view @nexub/react version   # should show new version
npm view @nexub/tokens version
```

---

### Step 7 — Commit, tag, push (AI does this)

```bash
git add packages/*/package.json packages/*/CHANGELOG.md .changeset/
git commit -m "chore(release): vX.X.X"
git tag vX.X.X
git push origin development
git push origin vX.X.X
```

---

### Step 8 — Update this file

Add a row to the [Release History](#release-history) table above with:
- Version
- Date
- Bump type (patch/minor/major)
- One-line summary
- Link to GitHub tag

---

## Troubleshooting

### `workspace:*` dependencies in published package
pnpm automatically rewrites `workspace:*` to the real version number on publish.
No manual action needed. Verify with `npm pack --dry-run` and inspect `package.json` in the tarball.

### DTS build error: "Could not find declaration file for @nexub/icons"
Build packages in dependency order (tokens → icons → react → patterns).
Turbo's parallel build can start `patterns` before `icons` DTS finishes.

### "You must be logged in to publish packages"
Run `npm login` and confirm with `npm whoami` before publishing.

### "Package name too similar to existing package" / 403 on first publish
The `@nexub` scope must exist on npm and you must have publish rights.
Create the org at https://www.npmjs.com/org/create if needed.

### Publish succeeded but `npm view` shows old version
npm CDN propagates in ~30 seconds. Wait and re-run `npm view`.

---

## What ships in each package

| Package | Ships | Does NOT ship |
|---|---|---|
| `@nexub/tokens` | `dist/` (CSS vars, JS, Tailwind preset, JSON) | `src/`, `scripts/`, tests |
| `@nexub/themes` | `src/` (raw CSS files) | nothing extra — CSS is the source |
| `@nexub/icons` | `dist/` (ESM + CJS + types) | `src/`, tests |
| `@nexub/react` | `dist/` (ESM + CJS + types) | `src/`, tests, stories |
| `@nexub/patterns` | `dist/` (ESM + CJS + types) | `src/`, tests |

---

## Peer Dependencies

Consumers of `@nexub/react` must have:
```json
"react": ">=18 <20",
"react-dom": ">=18 <20"
```

Consumers of `@nexub/patterns` must also have:
```json
"@nexub/react": "*"
```

`@nexub/tokens` and `@nexub/themes` have no peer deps.
`@nexub/icons` requires `react >=18 <20`.
