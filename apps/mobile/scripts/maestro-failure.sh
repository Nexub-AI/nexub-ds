#!/bin/sh
# Printed into the CI log when a Maestro flow fails (iOS and Android), so the
# failing command and Maestro's own error are readable without the artifact.
# $1: the --test-output-dir of the failed run.
echo '::group::Maestro failed command'
# The commands-*.json layout varies by Maestro version, so match loosely: any
# entry whose JSON mentions a failure, else the last three commands run.
find "$1" -name 'commands*.json' 2>/dev/null | while read -r f; do
  python3 - "$f" <<'PY'
import json, sys
path = sys.argv[1]
try:
    cmds = json.load(open(path))
except Exception as e:
    print(path, 'unreadable:', e); sys.exit()
if isinstance(cmds, dict):
    cmds = cmds.get('commands', list(cmds.values()))
failed = [c for c in cmds if 'FAIL' in json.dumps(c).upper()]
print(path)
for c in (failed or cmds[-3:]):
    print(' ', json.dumps(c)[:1500])
PY
done
ls -R "$1" 2>/dev/null | head -n 30
echo '::endgroup::'
echo '::group::Screen at the failed step (Maestro hierarchy)'
find "$1" -path '*screen-hierarchy*' -name '*.json' 2>/dev/null | while read -r f; do
  echo "$f"
  grep -oE '"(text|accessibilityText|title|label)" *: *"[^"]+"' "$f" | sort -u | head -n 80
done
echo '::endgroup::'
echo '::group::App and JS errors (device log)'
find "$1" -name 'device-*.log' -o -name 'device-logcat.txt' 2>/dev/null | while read -r f; do
  echo "$f"
  grep -iE 'ReactNativeJS|RCTFatal|Unhandled JS|TypeError|ReferenceError|Invariant|Exception|Terminating app|crash|NexubMobile.*(error|fault)' "$f" | tail -n 60
done
echo '::endgroup::'
echo '::group::Maestro log (tail)'
find "$1" -name 'maestro.log' 2>/dev/null | while read -r f; do tail -n 60 "$f"; done
echo '::endgroup::'
echo '::group::Text on screen (Maestro view hierarchy)'
maestro hierarchy 2>/dev/null | grep -oE '"(text|accessibilityText|bounds)" *: *"[^"]+"' | head -n 120
echo '::endgroup::'
