#!/bin/sh
# 9.5 mobile soak (iOS simulator): runs .maestro/soak for about SOAK_MINUTES and samples the
# app's memory (RSS) every 20 s. Fails when Maestro fails (a crash, a screen that never
# appears) or when memory keeps growing: the last quarter's median against the second
# quarter's (the first is warm-up), allowed x1.25 + 40 MB.
#   sh apps/mobile/scripts/soak.sh            # SOAK_MINUTES=30
set -u
MINUTES="${SOAK_MINUTES:-30}"
# One lap takes about 45 s on a CI simulator.
LAPS=$((MINUTES * 60 / 45))
OUT="${SOAK_OUT:-maestro-soak-out}"
RSS="$OUT/rss.txt"
mkdir -p "$OUT"
: > "$RSS"

maestro test apps/mobile/.maestro/soak -e LAPS="$LAPS" --test-output-dir "$OUT" &
MAESTRO=$!
while kill -0 "$MAESTRO" 2>/dev/null; do
  # A simulator app is a host process: NexubMobile.app/NexubMobile.
  PID=$(pgrep -f 'NexubMobile.app/NexubMobile' | head -1)
  [ -n "$PID" ] && ps -o rss= -p "$PID" >> "$RSS"
  sleep 20
done
wait "$MAESTRO" || { echo "Soak: Maestro failed after $(wc -l < "$RSS" | tr -d ' ') memory samples"; exit 1; }

python3 - "$RSS" <<'PY'
import statistics, sys
kb = [int(x) for x in open(sys.argv[1]).read().split()]
q = len(kb) // 4
if q < 2:
    sys.exit(f"Soak: only {len(kb)} memory samples, too few to judge")
settled, final = statistics.median(kb[q:2 * q]), statistics.median(kb[-q:])
print(f"Soak: memory settled at {settled / 1024:.0f} MB, ended at {final / 1024:.0f} MB over {len(kb)} samples")
if final > settled * 1.25 + 40 * 1024:
    sys.exit("Soak: memory kept growing")
PY
