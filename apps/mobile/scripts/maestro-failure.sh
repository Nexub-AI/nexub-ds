#!/bin/sh
# Printed into the CI log when a Maestro flow fails (iOS and Android), so the
# failing command and Maestro's own error are readable without the artifact.
# $1: the --test-output-dir of the failed run.
echo '::group::Maestro failed command'
for f in "$1"/commands-*.json; do
  [ -f "$f" ] || continue
  python3 - "$f" <<'PY'
import json, sys
cmds = json.load(open(sys.argv[1]))
for i, c in enumerate(cmds):
    meta = c.get('metadata', {})
    if meta.get('status') == 'FAILED':
        print(sys.argv[1])
        for prev in cmds[max(0, i - 3):i]:
            print('  ok  ', json.dumps(prev.get('command'))[:300])
        print('  FAIL', json.dumps(c.get('command'))[:600])
        print('  error:', json.dumps(meta.get('error'))[:2000])
PY
done
echo '::endgroup::'
echo '::group::Text on screen (Maestro view hierarchy)'
maestro hierarchy 2>/dev/null | grep -oE '"(text|accessibilityText|bounds)" *: *"[^"]+"' | head -n 120
echo '::endgroup::'
