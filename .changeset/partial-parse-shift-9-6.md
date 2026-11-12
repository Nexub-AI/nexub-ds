---
'@nexub/react': minor
---

`TopNav`: the inner row now has the header's full height, so it no longer grows (and re-centres the logo) when a browser paints while later, taller children are still being parsed. No visual change. The docs previews are hidden until fully parsed for the same reason; this was the cause of the occasional layout shift on a random docs page.
