import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'celebrate',
    title: 'Celebrate',
    description: 'A short confetti burst for a real win, such as a first payment or finishing onboarding.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.3.0',
    related: ['toast', 'button'],
  },
  props: [
    { name: 'active', type: 'boolean', required: true, description: 'Bursts each time this goes from false to true.' },
    { name: 'count', type: 'number', default: '28', required: false, description: 'Number of pieces.' },
  ],
  usage: {
    whenToUse: ['A rare, real win the user worked for: first payment received, onboarding finished, a goal reached.'],
    whenNotToUse: ['Routine saves or every success; use the Button success state or a Toast.', 'As the only feedback: say what happened in text too.'],
  },
  examples: [{ title: 'On a win' }],
  a11y: {
    screenReader: ['Decorative (`aria-hidden`). Announce the win in text, for example in a Toast or a status message.'],
    notes: ['Hidden under reduced motion.'],
  },
};

export default entry;
