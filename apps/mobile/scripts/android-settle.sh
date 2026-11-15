#!/bin/sh
# After a (slow) boot the emulator keeps compiling apps in the background
# (bg-dexopt) for minutes. That load starved the UI mid-run: screenshots came
# out blank (banner--0) and "isn't responding" dialogs covered previews. Run
# that job now, synchronously, so the flows start on an idle device, and keep
# any ANR dialog from covering a screenshot. Capped at 5 min; best effort.
timeout 300 adb shell cmd package bg-dexopt-job >/dev/null 2>&1 || echo 'bg-dexopt-job did not finish in 5 min; continuing'
adb shell settings put global hide_error_dialogs 1 || true
# Idle: load average (1 min) under 2, checked every 5 s, for at most 2 min.
i=0
while [ "$i" -lt 24 ]; do
  load=$(adb shell cat /proc/loadavg 2>/dev/null | cut -d' ' -f1)
  [ -n "$load" ] && [ "${load%%.*}" -lt 2 ] && break
  i=$((i + 1))
  sleep 5
done
echo "Emulator load: ${load:-unknown}"
