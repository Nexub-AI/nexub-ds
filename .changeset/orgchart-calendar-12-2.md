---
'@nexub/react': minor
'@nexub/core': minor
---

`OrgChart`: `zoomable` adds a zoom toolbar (zoom out, level, zoom in, fit), pinch, ctrl/⌘ + wheel, drag to pan and + / - / 0 keys (`zoom`/`defaultZoom`/`onZoomChange`, `minZoom`/`maxZoom`, 0.25–2), and `stackAbove={n}` stacks a node's reports in a compact column when it has more than `n`, so wide teams fit without changing the tree semantics. New messages: `orgChartZoom`, `orgChartZoomIn`, `orgChartZoomOut`, `orgChartZoomFit`, `orgChartZoomLevel`.

`EventCalendar`: `color` on an event (and on a legend item) takes any brand colour (hex, rgb(), hsl(), oklab(), oklch()) and stays readable in light and dark: the container is mixed into the surface and the text picked for 4.5:1 contrast. It wins over `tone`; an unreadable colour keeps the tone and warns in development.
