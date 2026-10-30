---
'@nexub/react-native': patch
---

`nxEnter`, `nxExit` and `nxLayout` return `undefined` on iOS, so banners, list rows, chips and amounts appear in place there (as in 2.1.0) while Android keeps the motion. With these layout-animation presets on a screen, iOS UI tests stopped finding views that were on screen, with spring and timed presets alike. `nxSpring` (press feedback, sheets, switches, the segmented control) is unchanged on both platforms. The toast uses Reanimated's stock fade again, as in 2.1.0.
