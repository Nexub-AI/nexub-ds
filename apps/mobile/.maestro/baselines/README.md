# Screenshot baselines

One PNG per docs preview example, per platform (`ios/`, `android/`), taken by
`.maestro/previews` in the Mobile workflow and downscaled to 360 px wide.

| File | What |
|---|---|
| `<slug>--<example>--<platform>.png` | A component example, light |
| `pattern-<name>--<platform>.png` | A screen pattern, light |
| `pattern-<name>--dark--<platform>.png` | The same screen in the dark scheme |
| `pattern-<name>--hc--<platform>.png` | High contrast (light) |
| `pattern-<name>--rtl--<platform>.png` | Right-to-left layout (the text stays English) |
| `pattern-<name>--lg--ios.png` | Large text: the simulator's text size at `extra-extra-extra-large` |

The extra schemes cover the 18 screen patterns only. Every component example in
every scheme would multiply the longest CI step by five. Dark, high contrast
and RTL are deep-link queries (`?scheme=dark`, `?contrast=high`, `?dir=rtl`) at
the end of `previews.yaml`. Large text is an OS setting an app can't override,
so it is its own flow (`.maestro/previews-lg`), run after the workflow turns the
setting up. It is iOS only: on the Android emulator a second Maestro run in the
same job loses adb, and the setting can't change in the middle of one run.

- **CI compares** every run against these files (`scripts/screenshot-gate.sh`).
  Tolerance: iOS 0.1 % of pixels, Android 0.5 %; 1 % for the few examples
  that animate (spinner, Skeleton; see `ANIMATED` in `scripts/screenshots.mjs`).
  The status bar is masked.
  Diffs (changed pixels in magenta) are in the `maestro-<platform>` artifact
  under `screenshot-diffs/`.
- **Intended visual change, or a new example?** The Mobile workflow does not
  run on pull requests. Delete the platform's folder on your branch, push, and
  run the workflow by hand on that branch (Actions → Mobile → Run workflow, or
  `gh workflow run mobile.yml --ref <branch>`). That run records fresh
  baselines, commits them to the branch (`[skip ci]`), and fails once on
  purpose; run it again to compare against them. Do it before the branch
  merges: on `development` a missing or stale baseline fails the run.
- **The same limits for every scheme.** `pattern-search--dark` gets the looser
  limit `pattern-search` has.
- The docs site shows the light files as the "On device" shots on native pages.
