#!/bin/sh
# Printed into the CI log when a Maestro flow fails (iOS and Android), so the
# failing command and Maestro's own error are readable without the artifact.
# $1: the --test-output-dir of the failed run.
echo '::group::Maestro failed command'
# The commands-*.json layout varies by Maestro version, so match loosely: any
# entry whose JSON mentions a failure, else the last three commands run.
find "$1" -name 'commands-*.json' 2>/dev/null | while read -r f; do
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
echo '::group::Text on screen (Maestro view hierarchy)'
maestro hierarchy 2>/dev/null | grep -oE '"(text|accessibilityText|bounds)" *: *"[^"]+"' | head -n 120
echo '::endgroup::'
