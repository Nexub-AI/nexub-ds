# QR Code

A QR code as an SVG, always dark on light so it scans in every theme, with its value shown as text.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { QrCode } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/qr-code

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string` |  | The text to encode, usually a URL. Up to 2,953 bytes of UTF-8 (1,273 with a logo). |
| `size` | `number \| string` | `160` | Width of the code: pixels, or any CSS length. It never grows past its container. |
| `ecc` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M', or 'H' with a logo` | Error correction: how much of the code may be damaged or covered (7%, 15%, 25%, 30%). |
| `logo` | `ReactNode` |  | A mark in the centre, on a light tile a fifth of the width. |
| `quietZone` | `number` | `4` | Light margin around the code, in modules. Readers need 4. |
| `label` | `string` | `"QR code for <value>"` | Text alternative of the image. The default is English: pass your own to translate it. |
| `caption` | `ReactNode \| false` | `the value` | The text under the code, so it can be read and typed without a camera. `false` hides it. |

## Example: Default

```tsx
import { QRCode } from '@nexub/react';

export default function Example() {
  return <QRCode value="https://example.com/h/4729" />;
}
```

## Example: With a logo and a caption

```tsx
import { QRCode } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  return <QRCode value="https://example.com/h/4729" size={200} logo={<Sparkles />} caption="example.com/h/4729" label="QR code for order 4729" />;
}
```

Related: [aspect-ratio](aspect-ratio.md), [otp-input](otp-input.md)
