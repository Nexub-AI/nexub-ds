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
<MediaCard
  src="/covers/lisbon.jpg"
  alt=""
  eyebrow="Guide"
  title="A weekend in Lisbon"
  description="Where to eat, walk and stay."
  href="/guides/lisbon"
/>
```

## Example: Without link, with actions

```tsx
<MediaCard src="/covers/q3.jpg" alt="" title="Q3 brand shoot" description="48 photos">
  <Button size="sm" variant="tonal">Open</Button>
  <Button size="sm" variant="text">Share</Button>
</MediaCard>
```

## Example: Ratios

```tsx
<MediaCard ratio="16/9" src={src} alt="" title="16/9" />
<MediaCard ratio="4/3" src={src} alt="" title="4/3" />
<MediaCard ratio="1/1" src={src} alt="" title="1/1" />
<MediaCard ratio="3/4" src={src} alt="" title="3/4" />
```

## Accessibility

- Roles: link (when `href` is set), heading level 3 (title)
- `Tab`: Focuses the link (the card shows the focus ring), then any actions.
- `Enter`: Follows the link.
- With `href`, the link’s name is the title only, not the whole caption.
- Most card images repeat the title, so `alt=""` is usually right.

Related: [card](card.md)
