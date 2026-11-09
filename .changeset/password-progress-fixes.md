---
'@nexub/react': patch
'@nexub/themes': patch
---

Security and bug fixes.

- `PasswordInput`: revealed text no longer reaches browser spellcheck, autocorrect or autocapitalize (`spellCheck={false}`, `autoCorrect="off"`, `autoCapitalize="off"`, which can't be overridden). `autoComplete` now defaults to `current-password`; pass `autoComplete="new-password"` on sign-up forms.
- `Progress`: leaving out `value` now renders the indeterminate state as intended (no `aria-valuenow`, a sliding segment). Previously `value` defaulted to 0, so indeterminate never showed. `value={0}` is unchanged.
