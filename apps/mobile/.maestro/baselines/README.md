# Screenshot baselines

One PNG per docs preview example, per platform (`ios/`, `android/`), taken by
`.maestro/previews` in the Mobile workflow and downscaled to 360 px wide.

- **CI compares** every run against these files (`scripts/screenshot-gate.sh`).
  Tolerance: iOS 0.1 % of pixels, Android 0.5 %; 1 % for the few examples
  that animate (spinner, Skeleton; see `ANIMATED` in `scripts/screenshots.mjs`).
  The status bar is masked.
  Diffs (changed pixels in magenta) are in the `maestro-<platform>` artifact
  under `screenshot-diffs/`.
- **Intended visual change?** Delete the platform's folder in your PR and push.
  The next run records fresh baselines, commits them to the PR branch, and
  fails once on purpose; push again to compare against them.
- The docs site shows these files as the "On device" shots on native pages.
