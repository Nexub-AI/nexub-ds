---
"@nexub/themes": minor
"@nexub/react": minor
---

Vivid: the opt-in expressive layer.

- **`@nexub/themes/vivid`** with `data-expression="vivid"` on `<html>` or any area. Everything is scoped to that attribute, so apps that never set it are unchanged.
- **Accent gradient** from your primary colour, sweeping 50° round the hue wheel at the same lightness (blue to violet, green to teal), so every brand gets its own pair and on-primary text keeps its contrast. Filled buttons get the gradient, a soft accent glow and a small lift on hover; switches, checkboxes, radios and progress bars use it too.
- **Tinted depth:** elevation shadows take the accent instead of grey, and interactive cards pick up a gradient edge and glow on hover. Controls get a soft accent halo around the focus ring.
- **`Aurora`**: a new decorative background of slow-drifting colour fields from your accent roles (deeper and more saturated in dark mode). Server component, `aria-hidden`; still under reduced motion, hidden in forced colours.
- High contrast turns the gradients into flat fills and removes the glow. Browsers without CSS relative colours keep the flat fills.
- `Button` and `Card` now expose `data-variant` as a styling hook.
- New docs page: Foundations → Expression, with Calm and Vivid side by side.
