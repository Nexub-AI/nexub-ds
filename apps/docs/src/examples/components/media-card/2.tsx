import { MediaCard } from '@nexub/react';

// Gradient placeholder image: a data: URI keeps it inside the docs CSP (img-src 'self' data:).
const COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>',
  );

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-start justify-center">
      {(['16/9', '4/3', '1/1', '3/4'] as const).map((r) => (
        <div key={r} className="w-[160px]">
          <MediaCard ratio={r} src={COVER} alt="" title={r} />
        </div>
      ))}
    </div>
  );
}
