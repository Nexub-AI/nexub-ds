import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'qr-code',
    title: 'QR Code',
    description: 'A QR code as an SVG, always dark on light so it scans in every theme, with its value shown as text.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.9.0',
    related: ['aspect-ratio', 'otp-input'],
  },
  props: [
    { name: 'value', type: 'string', required: true, description: 'The text to encode, usually a URL. Up to 2,953 bytes of UTF-8 (1,273 with a logo).' },
    { name: 'size', type: 'number | string', default: '160', description: 'Width of the code: pixels, or any CSS length. It never grows past its container.' },
    { name: 'ecc', type: "'L' | 'M' | 'Q' | 'H'", default: "'M', or 'H' with a logo", description: 'Error correction: how much of the code may be damaged or covered (7%, 15%, 25%, 30%).' },
    { name: 'logo', type: 'ReactNode', description: 'A mark in the centre, on a light tile a fifth of the width.' },
    { name: 'quietZone', type: 'number', default: '4', description: 'Light margin around the code, in modules. Readers need 4.' },
    { name: 'label', type: 'string', default: '"QR code for <value>"', description: 'Text alternative of the image. The default is English: pass your own to translate it.' },
    { name: 'caption', type: 'ReactNode | false', default: 'the value', description: 'The text under the code, so it can be read and typed without a camera. `false` hides it.' },
  ],
  examples: [{ title: 'Default' }, { title: 'With a logo and a caption' }],
};

export default entry;
