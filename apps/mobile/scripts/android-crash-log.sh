#!/bin/sh
# Printed into the CI log when a Maestro flow fails on the Android emulator, so
# the cause is readable without downloading the artifact: the crash buffer,
# React Native's JS errors, and the tail of Maestro's own log.
echo '::group::Android crash buffer'
adb logcat -d -b crash | tail -n 80
echo '::endgroup::'
echo '::group::React Native / AndroidRuntime errors'
adb logcat -d -s ReactNativeJS:E ReactNative:E AndroidRuntime:E | tail -n 120
echo '::endgroup::'
echo '::group::Text on screen (Maestro view hierarchy)'
maestro hierarchy 2>/dev/null | grep -oE '"(text|accessibilityText|resource-id)" *: *"[^"]+"' | head -n 80
echo '::endgroup::'
echo '::group::Maestro log'
log=$(ls -t "$HOME"/.maestro/tests/*/maestro.log 2>/dev/null | head -n 1)
[ -n "$log" ] && grep -E 'FAILED|Failed|Exception|Assertion|COMPLETED|Running' "$log" | tail -n 60
echo '::endgroup::'
