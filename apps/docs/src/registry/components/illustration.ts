import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'illustration',
    title: 'Illustration',
    description: 'A spot illustration for an empty, error, offline, success or full-page state, drawn in code so it follows the theme, dark mode and the product accent.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'alpha',
    addedIn: '10.5.0',
    updatedIn: '12.3.0',
    related: ['empty-state', 'error-state'],
  },
  props: [
    { name: 'kind', type: "'noData' | 'noResults' | 'noAccess' | 'serverError' | 'offline' | 'notFound' | 'maintenance' | 'success'", required: true, description: 'Which drawing to show. Empty: noData or noResults; error: serverError, noAccess or notFound; offline; success (12.3).' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '80, 120 or 160 CSS px wide.' },
    { name: 'title', type: 'string', description: 'Names the drawing for assistive technology. Without it the drawing is decorative.' },
  ],
  examples: [
    { title: 'Default' },
    { title: 'Kinds' },
    {
      title: 'In a state',
      description: 'Opt in on the surfaces that already exist: put it in `EmptyState.Illustration`, set `illustrated` on `EmptyStatePreset`, or pass it as `illustration` to `StatusPage`. On native, `EmptyState`, `ErrorState` and `ResultScreen` take it as `illustration`.',
    },
  ],
  a11y: {
    roles: ['img (only with a `title`)'],
    screenReader: [
      'Decorative by default: the svg has `aria-hidden`, so the state is read from its title and description alone.',
      'With `title` it is one image named by the title (`role="img"`, `aria-label`).',
    ],
    notes: [
      'Colours are roles only, so light, dark and product themes recolour it. Under forced colours every shape takes a system colour (Canvas / CanvasText), so the outline stays legible.',
      'Each drawing is a handful of shapes, well under 1 kB gzipped; no asset is fetched.',
    ],
  },
};

export default entry;
