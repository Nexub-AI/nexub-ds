import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'media-card',
    title: 'Media Card',
    description: 'An image card with a glass caption over a soft scrim. With `href`, the whole card is one link.',
    category: 'Layout',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.6.0',
    related: ['card'],
  },
  props: [
    { name: 'src', type: 'string', required: true, description: 'Image URL. Loaded lazily.' },
    { name: 'alt', type: 'string', required: true, description: "Image description. Pass '' when the image is decorative." },
    { name: 'ratio', type: "'16/9' | '4/3' | '1/1' | '3/4'", default: "'16/9'", required: false, description: 'Aspect ratio of the image box.' },
    { name: 'title', type: 'ReactNode', required: false, description: 'Caption title, rendered as an h3.' },
    { name: 'description', type: 'ReactNode', required: false, description: 'Caption text under the title.' },
    { name: 'eyebrow', type: 'ReactNode', required: false, description: 'Small label above the title.' },
    { name: 'href', type: 'string', required: false, description: 'Makes the whole card one link, stretched from the title (so it needs `title`). Adds the hover lift and image zoom.' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Actions under the caption. They stay clickable above the stretched link.' },
  ],
  examples: [
    {
      title: 'With link',
      code: `<MediaCard
  src="/covers/lisbon.jpg"
  alt=""
  eyebrow="Guide"
  title="A weekend in Lisbon"
  description="Where to eat, walk and stay."
  href="/guides/lisbon"
/>`,
    },
    {
      title: 'Without link, with actions',
      code: `<MediaCard src="/covers/q3.jpg" alt="" title="Q3 brand shoot" description="48 photos">
  <Button size="sm" variant="tonal">Open</Button>
  <Button size="sm" variant="text">Share</Button>
</MediaCard>`,
    },
    {
      title: 'Ratios',
      code: `<MediaCard ratio="16/9" src={src} alt="" title="16/9" />
<MediaCard ratio="4/3" src={src} alt="" title="4/3" />
<MediaCard ratio="1/1" src={src} alt="" title="1/1" />
<MediaCard ratio="3/4" src={src} alt="" title="3/4" />`,
    },
  ],
  a11y: {
    roles: ['link (when `href` is set)', 'heading level 3 (title)'],
    keyboard: [
      { key: 'Tab', description: 'Focuses the link (the card shows the focus ring), then any actions.' },
      { key: 'Enter', description: 'Follows the link.' },
    ],
    screenReader: [
      'With `href`, the link’s name is the title only, not the whole caption.',
      "Most card images repeat the title, so `alt=\"\"` is usually right.",
    ],
  },
};

export default entry;
