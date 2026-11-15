import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tabs',
    title: 'Tabs',
    description: 'Layered content panels switched by tab triggers. Built on Radix UI Tabs.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'defaultValue', type: 'string', required: false, description: 'Initially active tab value (uncontrolled).' },
    { name: 'value', type: 'string', required: false, description: 'Controlled active tab value.' },
    { name: 'onValueChange', type: '(value: string) => void', required: false, description: 'Callback when active tab changes.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Layout direction of the tab list.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Vertical',
      description: 'orientation="vertical": the indicator slides on the inline-end edge, and arrow up/down move between tabs.',
    },
  ],
  usage: {
    whenToUse: [
    "Switching between related views within the same page context",
    "Organising content that belongs to the same entity",
    "Reducing visual clutter by hiding secondary content behind tabs",
    "Horizontal navigation within a bounded section",
    ],
    whenNotToUse: [
    "Global site navigation — use the sidebar or top nav",
    "Sequential steps in order — use Stepper",
    "Comparing content side-by-side — keep both views visible",
    "More than 5–7 tabs — consider a Select or sub-navigation",
    ],
  },
};

export default entry;
