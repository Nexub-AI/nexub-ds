# Incident runbook

What to do when something is wrong with a published `@nexub/*` version, the docs site or the release pipeline. Written to be followed under pressure: do the steps in order, and write down the time of each one in the advisory or issue as you go.

Policy lives in [`SECURITY.md`](./SECURITY.md). How a normal release works is in [`PUBLISHING.md`](./PUBLISHING.md).

## Severity and clocks

| Severity | Example | Acknowledge | Fix on npm |
|---|---|---|---|
| Critical | Script runs from data a component renders; a published tarball that was not built by our workflow | 1 working day | 24 hours from confirming it |
| High | A guard (`safeHref`, CSV escaping, CSP) can be bypassed in a realistic app | 3 working days | 7 days |
| Medium / low | Needs an unusual setup, or only affects the docs site | 3 working days | Next scheduled release, 30 days at most |

Score with CVSS 3.1 in the advisory form. When unsure between two levels, take the higher one.

## 1. A vulnerability is reported

Reports arrive as a private GitHub advisory (Security → Advisories) or by email to security_report@nexub.com. A report in a public issue: copy it into a new draft advisory, then replace the issue text with "Moved to a private advisory" and close it.

1. **Acknowledge** inside the clock above. Say who is handling it and when the reporter hears next.
2. **Reproduce** on the latest version, in a test. No reproduction after two tries: ask the reporter for one before spending more time.
3. **Open or accept the draft advisory.** Fill in the affected packages and version range, the CVSS score and a description that doesn't yet include the exploit.
4. **Fix in the advisory's private fork** (the "Start a temporary private fork" button) when the issue is high or critical, so the fix isn't public before the release. Medium and low can go through a normal PR with a neutral title.
5. **Add the reproduction as a test** that fails before the fix. If it is an input a component should neutralise, add it to `packages/react/src/utils/xss-corpus.ts` so every component is checked against it from then on.
6. **Ship it** with the hotfix steps below.
7. **Publish the advisory** once the fixed version is on npm. Request a CVE from the advisory page for high and critical issues (GitHub is the CVE numbering authority; it usually takes one to three days). Credit the reporter unless they asked not to be named.
8. **Tell consumers**: the advisory notifies everyone with Dependabot alerts on. Also post the version to upgrade to in the release notes and in Discussions → Announcements.
9. **Review** within a week (last section).

## 2. Hotfix: a patch on the latest version

Fixes ship on the latest version only, as a patch, and don't wait for the next scheduled release.

1. Branch from `development`. Make the smallest change that fixes it, with its test.
2. Add a changeset with `patch`:

   ```md
   ---
   '@nexub/react': patch
   ---

   Fix <what the consumer sees>.
   ```

3. Open the PR into `development`. Wait for CI; don't skip it. Merge.
4. Promote `development` → `staging` → `production`, each as a PR, each after its CI.
5. Merge the "Version Packages" PR that the release workflow opens on `production`. That publishes.
6. Check the release run is green. It verifies the provenance of every published tarball and signs the tag itself.
7. Merge the back-merge PR into `development`.

**Measured.** The 9.7.0 publish fix (PR #598, 2026-11-12) went from PR opened to the version on npm in 61 minutes through all three environments. A patch adds the Version Packages PR, about 15 minutes more. So a fix that is written and tested by hour 20 still makes the 24-hour clock; the fix itself has most of a day.

When CI is the thing that is broken, fix CI first. A release that skipped its gates is a second incident.

### During the 10.0 release-candidate soak

Production is on 9.9.x, which publishes to the `next` tag; `latest` is 9.8.0 and can't get a 9.8.1. If `latest` users need the fix, remove the 9.9 rule from `distTag` in `scripts/publish-tarballs.mjs` in the fix PR. 9.9.x then publishes to `latest`, and the advisory names 9.9.x as the patched version.

## 3. A bad version is on npm

A version that breaks consumers or carries the vulnerability.

1. **Don't unpublish.** npm only allows it for 72 hours and it breaks every lockfile that has the version.
2. **Publish the fix** as the next patch (section 2). `latest` moves to it.
3. **Deprecate the bad version** so installs warn. This needs an npm owner's login (trusted publishing can't deprecate):

   ```bash
   npm deprecate @nexub/react@<bad version> "Security fix in <fixed version>. Upgrade."
   ```

   All ten packages release together, so deprecate the same version of each one that is affected.
4. If it is a vulnerability, continue from step 7 of section 1.

## 4. A release nobody made, or a tarball that fails verification

Signs: a version on npm with no matching release run, `gh attestation verify` fails for a published tarball, the "Verify provenance" step of the release run is red, or an unsigned or wrongly signed `v<version>` tag.

1. **Stop releases**: disable the `Release` workflow (Actions → Release → ⋯ → Disable workflow).
2. **Check what npm is serving** against what we built:

   ```bash
   npm pack @nexub/react@<version>
   shasum -a 256 nexub-react-<version>.tgz        # compare with checksums.txt on the GitHub release
   gh attestation verify nexub-react-<version>.tgz --repo Nexub-AI/nexub-ds \
     --signer-workflow Nexub-AI/nexub-ds/.github/workflows/build-release.yml
   ```

3. **If the tarball is not ours**: treat it as critical. Deprecate the version at once with a "do not install" message, report it to npm (support → "Report malware"), and open a public advisory naming the version.
4. **Find the way in.** npm → each package → Settings → Trusted publisher must name only this repository and `release.yml`; there must be no automation tokens. GitHub → Settings → audit log for the hour before the publish. Review who has write access to `production`.
5. **Rotate** the Cloudflare API token and the feedback webhook and Turnstile secrets if a workflow or a maintainer account may have been exposed. There is no npm token to rotate.
6. Release a clean patch from a commit you have read, then re-enable the workflow.

### A release step failed after the publish

The packages are on npm but the run is red because the provenance check or the tag signing failed.

- Provenance check: run the commands in step 2 by hand. If they pass, it was registry lag: re-run the failed job. If they fail, this is section 4.
- Signed tag: re-run the failed job; `scripts/signed-tag.sh` leaves an existing tag alone. Then merge the back-merge PR, which the red run did not open (`gh pr create --base development --head production`).

## 5. The docs site or its feedback endpoint

- **Defaced or serving something we didn't deploy**: Cloudflare Pages → the project → Deployments → roll back to the last good one. Then rotate the Cloudflare API token and check the Pages project's members.
- **Feedback endpoint abused** (spam or load): Cloudflare → Security → WAF → add a rate-limiting rule or a block on `/api/feedback`. The endpoint needs a valid Turnstile token for every request, so rotating the Turnstile secret stops replayed tokens. To turn it off, remove the `GOOGLE_CHAT_WEBHOOK_URL` variable in the Pages project and redeploy: the endpoint then answers 503 and stores nothing.
- **A CSP or Trusted Types violation in production**: reproduce it with `pnpm --filter @nexub/react exec playwright test -c visual --project=docs docs.security`, fix forward. Don't loosen the policy to make the report go away.

## 6. A dependency advisory

- **Something we ship** (`pnpm audit --prod`), high or critical: check whether our code reaches the vulnerable function. If it does, or you can't tell in an hour, treat it as our vulnerability (section 1) and release a patch with the updated dependency.
- **A dev tool**: CI fails on any high or critical advisory (`pnpm audit --audit-level=high`). Upgrade the tool, or add an override in `package.json` for the patched version. Only when no patched version exists and the vulnerable code can't run in our use of the tool, add the advisory id to `pnpm.auditConfig.ignoreGhsas` and the reason to the table in `SECURITY.md`.

## 7. After every incident

Within a week, add a short entry to the advisory (or an issue labelled `incident` when there is no advisory): what happened, the timeline with the clock times you wrote down, how it got past the gates, and the one gate or test added so the same thing fails CI next time. An incident without a new test or gate isn't closed.
