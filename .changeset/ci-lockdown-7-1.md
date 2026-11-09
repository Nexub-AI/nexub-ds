---
'@nexub/react': minor
---

7.1: lock down CI.

- Releases are built in a job with no secrets. Publishing uses only npm trusted publishing (OIDC) on that build output, and each release now carries an SPDX SBOM on its GitHub release.
- CodeQL (JavaScript/TypeScript and GitHub Actions) and OpenSSF Scorecard run on every change to `development` and weekly.
- `Avatar`: after an image fails to load, a new `src` is tried again instead of staying on the fallback.
