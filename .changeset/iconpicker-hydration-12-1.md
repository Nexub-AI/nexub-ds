---
'@nexub/react': minor
---

Fix: `IconPicker` caused a hydration mismatch (React error #418) when a server-rendered page showed a value. The server had the icon set cached, but the browser hadn't loaded it yet. Hydration now matches the server HTML, and the icon appears as soon as the set loads. A picker mounted later still shows cached icons at once.
