---
"@nexub/tokens": minor
---

SwiftUI and Jetpack Compose tokens.

- **`@nexub/tokens/swift/NexubTokens.swift`** and **`@nexub/tokens/compose/NexubTokens.kt`**: the tokens as native source. Each has a colour set per scheme and contrast level (`light`, `dark`, `lightHighContrast`, `darkMediumContrast`…) with every role (`primary`, `onPrimary`, `surfaceContainerHigh`…), plus spacing (`space4`), radius (`radiusLg`), shape, sizes and the type scale (`typeBodyMd`: size, line height, weight, tracking) in points or dp.
- Built from the same resolved values as `@nexub/tokens/native` and the web tokens, with a test that fails the build if they drift; the Swift file type-checks against the iOS 17 SDK.
- Documented on Getting started → React Native.
