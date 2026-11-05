# Media Card

An image card with a glass caption over a soft scrim. With `href`, the whole card is one link.

- Package: `@nexub/react` · Category: Layout · Status: beta
- Import: `import { MediaCard } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/media-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` (required) | `string` |  | Image URL. Loaded lazily. |
| `alt` (required) | `string` |  | Image description. Pass '' when the image is decorative. |
| `ratio` | `'16/9' \| '4/3' \| '1/1' \| '3/4'` | `'16/9'` | Aspect ratio of the image box. |
| `title` | `ReactNode` |  | Caption title, rendered as an h3. |
| `description` | `ReactNode` |  | Caption text under the title. |
| `eyebrow` | `ReactNode` |  | Small label above the title. |
| `href` | `string` |  | Makes the whole card one link, stretched from the title (so it needs `title`). Adds the hover lift and image zoom. |
| `children` | `ReactNode` |  | Actions under the caption. They stay clickable above the stretched link. |

## Example: With link

```tsx
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
```

## Example: Without link, with actions

```tsx
import { MediaCard, Button } from '@nexub/react';

// Gradient placeholder image: a data: URI keeps it inside the docs CSP (img-src 'self' data:).
const COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>',
  );

export default function Example() {
  return (
    <div className="w-[320px]">
      <MediaCard src={COVER} alt="" title="Q3 brand shoot" description="48 photos">
        <Button size="sm" variant="tonal">Open</Button>
        <Button size="sm" variant="text">Share</Button>
      </MediaCard>
    </div>
  );
}
```

## Example: Ratios

```tsx
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
```

## Accessibility

- Roles: link (when `href` is set), heading level 3 (title)
- `Tab`: Focuses the link (the card shows the focus ring), then any actions.
- `Enter`: Follows the link.
- With `href`, the link’s name is the title only, not the whole caption.
- Most card images repeat the title, so `alt=""` is usually right.

Related: [card](card.md)
