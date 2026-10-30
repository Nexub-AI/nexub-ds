#!/bin/sh
# Wait until the CI emulator is really usable before installing and testing.
# Right after boot its adb connection can flap offline (Maestro then fails
# launchApp with "device offline"), and the runner's unlock keypress can leave
# the launcher's popup menu open on top.
adb wait-for-device
i=0
until [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = 1 ] \
  && [ "$(adb shell getprop init.svc.bootanim 2>/dev/null | tr -d '\r')" = stopped ] \
  && adb shell pm list packages android >/dev/null 2>&1; do
  i=$((i + 1))
  [ "$i" -ge 60 ] && { echo 'Emulator not ready after 120 s'; exit 1; }
  sleep 2
done
adb shell input keyevent KEYCODE_BACK
adb shell input keyevent KEYCODE_HOME
# Online for 10 s in a row, then go.
sleep 10
adb wait-for-device
adb shell true
