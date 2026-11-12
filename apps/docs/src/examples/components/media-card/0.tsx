'use client'; // docs preview: server pages import every example

import { MediaCard } from '@nexub/react';

// Gradient placeholder image: a data: URI keeps it inside the docs CSP (img-src 'self' data:).
const COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>',
  );

export default function Example() {
  return (
    <div className="w-[320px]">
      <MediaCard src={COVER} alt="" eyebrow="Guide" title="A weekend in Lisbon" description="Where to eat, walk and stay." href="#" />
    </div>
  );
}
