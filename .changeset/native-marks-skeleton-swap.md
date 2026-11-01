---
'@nexub/icons': minor
'@nexub/react-native': minor
---

Native marks and `SkeletonSwap` for React Native.

- `@nexub/icons/native` now has the Nexub marks under the same names as on web: `NexubMark` (`variant="color"` draws the brand gradient), `LeapMark`, `BookubMark`, `PayubMark`, `FounderubMark`, `ACRA`, `IRAS`, `MCA` and `GST`. They take the usual `size`, `color` and `label` props.
- `@nexub/react-native` adds `SkeletonSwap`, the twin of the web component: it crossfades from a skeleton to the loaded content in place on the motion springs, marks itself busy for screen readers while loading, and follows Reduce Motion. Content that is ready on first render shows without a fade.
