import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'popover',
    title: 'Popover',
    description: 'Floating content panel anchored to a trigger element.',
    category: 'Overlays',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Popover.Root', type: 'compound', required: false, description: 'Root provider that manages open/close state.' },
    { name: 'Popover.Trigger', type: 'compound', required: false, description: 'Element that toggles the popover on click.' },
    { name: 'Popover.Content', type: 'compound', required: false, description: 'The floating content panel.' },
    { name: 'Popover.Arrow', type: 'compound', required: false, description: 'Optional arrow pointing to the trigger.' },
    { name: 'Popover.Close', type: 'compound', required: false, description: 'Button that closes the popover.' },
    { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", required: false, description: 'Preferred side of the trigger to render the content.' },
    { name: 'align', type: "'start' | 'center' | 'end'", required: false, description: 'Alignment of the content relative to the trigger.' },
    { name: 'sideOffset', type: 'number', required: false, description: 'Distance in pixels between the trigger and the content.' },
    { name: 'surface', type: "'solid' | 'glass'", default: "'solid'", required: false, description: 'Glass material on Popover.Content — see Foundations → Materials.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With close button',
    },
  ],
};

export default entry;
