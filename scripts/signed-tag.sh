#!/bin/sh
# 9.7: creates an annotated tag signed with Sigstore (gitsign) and verifies it.
#   sh scripts/signed-tag.sh <tag> [--push]
# Run after chainguard-dev/actions/setup-gitsign, in a job with `id-token: write`.
# --push sends the tag with GH_TOKEN (release.yml). Without it the tag stays local
# (ci.yml rehearses the signing on every PR this way).
set -eu
TAG="$1"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config gpg.format x509
git config gpg.x509.program gitsign
git tag -s "$TAG" -m "$TAG"
# Rekor's search index lags the write by a few seconds, so verifying right after signing can
# report "could not find matching tlog entry" for a tag that is fine (2026-11-24, PR #775).
# Wait for the index: up to 6 tries, 5 s apart. A tag that never verifies still fails.
try=1
until gitsign verify-tag \
  --certificate-identity-regexp "^https://github.com/${GITHUB_REPOSITORY}/" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  "$TAG"; do
  if [ "$try" -ge 6 ]; then
    echo "signed-tag: $TAG did not verify after $try tries" >&2
    exit 1
  fi
  echo "signed-tag: verify try $try failed; waiting 5 s for the Rekor index" >&2
  try=$((try + 1))
  sleep 5
done
if [ "${2:-}" = "--push" ]; then
  git push "https://x-access-token:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" "refs/tags/$TAG"
fi
