# Security Policy

## Supported versions

All `@nexub/*` packages release together, under one version number. **Security fixes ship on the latest version only, as a patch, and don't wait for the next scheduled release.** There are no maintenance branches: to get a fix, upgrade to the latest version. Minor versions are additive, so that upgrade is safe inside a major.

## Reporting a vulnerability

Report it privately, in one of two ways:

- **GitHub:** [open a private advisory](https://github.com/Nexub-AI/nexub-ds/security/advisories/new) (Security → Advisories → Report a vulnerability). Preferred: it keeps the report, the fix and the credit in one place.
- **Email:** **security_report@nexub.com**

Include the affected package(s) and version(s), a description with a minimal reproduction if you can, and the impact you expect (for example, XSS through a component prop). Please don't open a public issue.

## What happens next

| Severity (CVSS 3.1) | We acknowledge within | Fix on npm within |
|---|---|---|
| Critical | 1 working day | 24 hours of confirming it |
| High | 3 working days | 7 days |
| Medium, low | 3 working days | 30 days |

1. We confirm the report and reproduce it in a test.
2. We fix it in private and release a patch.
3. We publish a GitHub Security Advisory with the affected and fixed versions. For high and critical issues we request a CVE through GitHub.
4. We credit you in the advisory and the release notes, unless you'd rather stay anonymous.

Please give us until the fix is released before you publish details. If we miss the clock above, tell us, and after 90 days it is your call.

The steps we follow are in [`INCIDENT_RUNBOOK.md`](./INCIDENT_RUNBOOK.md). The last internal review, its checklist and its findings are in [`SECURITY_REVIEW.md`](./SECURITY_REVIEW.md).

## Scope

In scope: the published `@nexub/*` packages, the docs site and its feedback endpoint (`apps/docs/functions`), the MCP server, and the release pipeline (a way to publish something we didn't build).
Out of scope: issues that need a compromised developer machine, and findings in third-party dependencies that have no exploitable path through our code (report those upstream).

## Supply chain

Since 9.7 every `@nexub/*` release can be traced to the commit and workflow that built it.

- **Build provenance (SLSA Build Level 3).** The tarballs are built, packed and attested in a reusable workflow (`.github/workflows/build-release.yml`) that holds no secret. The publish job uploads those exact files; it does not pack again. Verify a package you downloaded:

  ```bash
  npm pack @nexub/react@<version>
  gh attestation verify nexub-react-<version>.tgz --repo Nexub-AI/nexub-ds \
    --signer-workflow Nexub-AI/nexub-ds/.github/workflows/build-release.yml
  ```

  The same tarballs, their `checksums.txt` and the signed bundle (`nexub-provenance.intoto.jsonl`) are attached to the `@nexub/react@<version>` GitHub release, next to the SPDX SBOM. npm shows its own provenance for each version too (trusted publishing, no npm token is stored).
- **Signed release tag.** Each release gets a tag `v<version>` signed with Sigstore (gitsign) by the release workflow. Verify it:

  ```bash
  gitsign verify-tag --certificate-oidc-issuer https://token.actions.githubusercontent.com \
    --certificate-identity-regexp '^https://github.com/Nexub-AI/nexub-ds/' v<version>
  ```

- **Reproducible build.** Two builds of one commit give byte-identical tarballs. CI builds every PR twice, on two machines, and compares the hashes (`pnpm check:reproducible` does it locally).

## Dependency policy

Checked on every PR by `scripts/check-supply-chain.mjs`.

- **Runtime dependencies are listed, each with its reason,** in `dependency-policy.json`. A new one fails CI until it is added there, so adding a dependency is a reviewed decision. Prefer the platform, then code we own, then a dependency.
- **A release must be 7 days old** before pnpm resolves it (`minimumReleaseAge`) or Dependabot proposes it (`cooldown`), so a hijacked version has time to be caught.
- **The lockfile only holds registry packages with a sha512 integrity:** no git, URL or directory resolutions.
- **Install scripts are off** except for the packages named in `pnpm-workspace.yaml`.
- **Dependabot** opens one grouped PR a week. Review it within 5 working days. A PR that fixes an advisory of high or critical severity in something we ship is reviewed within 2 working days and released as a patch.

## Gates

- **Dependency advisories:** no high or critical advisory in any dependency, dev tools included (`pnpm audit --audit-level=high`). Blocking on every PR. An advisory is ignored only when no patched version exists and the vulnerable code can't run in our use of the tool. Each one is listed here and in `pnpm.auditConfig.ignoreGhsas`:

  | Advisory | Package | Why it can't be reached |
  |---|---|---|
  | GHSA-7pqw-9j4j-h8q3, GHSA-jmr9-qjv8-65gv | `extract-zip` (through Lighthouse CI → puppeteer-core) | It unpacks a browser download. Lighthouse CI uses the Chrome already on the runner and never downloads one. Not shipped |

- **CodeQL:** no open alert of high or critical severity. Blocking on every PR.
- **OpenSSF Scorecard:** at least `scorecardMin` in `security-gates.json`, which only goes up, toward 8. Blocking on every push to `development`.
