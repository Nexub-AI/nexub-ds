# Security Policy

## Supported versions

All `@nexub/*` packages release in lockstep. Security fixes ship on the latest minor only; please upgrade to receive them.

## Reporting a vulnerability

Email **security_report@nexub.com** with:

- the affected package(s) and version(s)
- a description and, if possible, a minimal reproduction
- the impact you expect (e.g. XSS through a component prop)

Please don't open a public issue. We acknowledge reports within 3 working days and aim to ship a fix within 30 days for high or critical issues. We'll credit you in the release notes unless you'd rather stay anonymous.

## Scope

In scope: the published `@nexub/*` packages and the docs site's feedback endpoint (`apps/docs/functions`).
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

- **CodeQL:** no open alert of high or critical severity. Blocking on every PR.
- **OpenSSF Scorecard:** at least `scorecardMin` in `security-gates.json`, which only goes up, toward 8. Blocking on every push to `development`.
