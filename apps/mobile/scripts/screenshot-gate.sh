#!/bin/sh
# Screenshot gate for the Maestro preview flow, run from the repo root in CI.
#   sh apps/mobile/scripts/screenshot-gate.sh <ios|android>
#
# With baselines in apps/mobile/.maestro/baselines/<platform>/: compare the
# screenshots this run took against them; diffs go to
# screenshot-diffs/ (uploaded as an artifact) and the job fails on drift.
#
# Without baselines, on a pull request: record them and push them to the PR
# branch (commit marked [skip ci], so the other platform's job isn't
# cancelled), then fail: green must mean a comparison passed, so the next
# push compares against what was recorded. To re-record a platform after an
# intended visual change, delete its baseline folder in the PR.
#
# Env: HEAD_REF (PR branch), PUSH_TOKEN (can push to it), REPO (owner/name).
set -eu
platform="$1"
dir="apps/mobile/.maestro/baselines/$platform"

# takeScreenshot lands in the repo root or under --test-output-dir, depending
# on the Maestro version (Android runs both flows into maestro-out); gather
# them in one place.
shots="screenshots-$platform"
mkdir -p "$shots"
{ find . -maxdepth 1 -type f -name "*--$platform.png"
  find maestro-out maestro-previews-out -type f -name "*--$platform.png" 2>/dev/null; } |
  while read -r f; do cp "$f" "$shots/"; done
echo "Found $(ls "$shots" | wc -l | tr -d ' ') $platform preview screenshots."

if ls "$dir"/*.png >/dev/null 2>&1; then
  node apps/mobile/scripts/screenshots.mjs compare "$platform" "$shots" --out screenshot-diffs
  exit $?
fi

if [ -z "${HEAD_REF:-}" ] || [ -z "${PUSH_TOKEN:-}" ]; then
  echo "::error::No $platform screenshot baselines in $dir, and this run can't record them (not a pull request)."
  exit 1
fi

node apps/mobile/scripts/screenshots.mjs record "$platform" "$shots"
work=$(mktemp -d)
git clone --quiet --depth 1 --branch "$HEAD_REF" "https://x-access-token:${PUSH_TOKEN}@github.com/${REPO}.git" "$work"
mkdir -p "$work/$dir"
cp "$dir"/*.png "$work/$dir/"
cd "$work"
git add "$dir"
git -c user.name='github-actions[bot]' -c user.email='41898282+github-actions[bot]@users.noreply.github.com' \
  commit --quiet -m "test(mobile): record $platform screenshot baselines [skip ci]"
# iOS and Android record in parallel and push to the same branch.
for attempt in 1 2 3 4 5; do
  git push --quiet origin "HEAD:$HEAD_REF" && break
  [ "$attempt" = 5 ] && { echo "::error::Could not push the $platform baselines."; exit 1; }
  sleep $((attempt * 3))
  git pull --quiet --rebase origin "$HEAD_REF"
done
count=$(ls "$dir"/*.png | wc -l | tr -d ' ')
echo "::error::Recorded $count $platform screenshot baselines and pushed them to $HEAD_REF. Push again (or re-run) to compare against them."
exit 1
