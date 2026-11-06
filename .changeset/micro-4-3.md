---
"@nexub/react": minor
"@nexub/themes": minor
---

Micro-interactions.

- **`Card effect="tilt"`**: the card leans toward the pointer in 3D while the sheen catches the light.
- **`Button magnetic`**: the button drifts a few pixels toward the pointer. For one key action per screen.
- **`Celebrate`**: a short confetti burst in the chart palette for a real win (first payment, onboarding done). Decorative, so announce the win in text too.
- **Pure CSS details:** the Switch thumb stretches toward where it is going while pressed; a field shakes once when it becomes invalid (`aria-invalid`); the focus ring on controls pops out instead of appearing.
- Pointer effects run only with a fine pointer; everything is off under reduced motion. Pointer positions go through the CSSOM, so it all stays strict-CSP safe.
