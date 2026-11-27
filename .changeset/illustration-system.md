---
'@nexub/react': minor
'@nexub/react-native': minor
---

`Illustration` gets a `success` kind, so the spot illustrations now cover empty, error, offline and success states. It follows the theme, dark mode and forced colours, and stays decorative unless you give it a `title`.
`Illustration` for React Native: the same eight kinds, `size` and `title` as on the web, drawn with react-native-svg in the theme's colour roles. It is hidden from VoiceOver and TalkBack unless you give it a `title`.
React Native `EmptyState`, `ErrorState` and `ResultScreen` take an optional `illustration` (for example `<Illustration kind="success" />`) that replaces the icon disc. Without it they look the same as before.
