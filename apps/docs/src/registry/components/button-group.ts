import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'button-group',
    title: 'ButtonGroup',
    description: 'Groups related buttons together with optional attachment and orientation.',
    category: 'Actions',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Lays out child buttons horizontally or vertically.' },
    { name: 'attached', type: 'boolean', default: 'false', required: false, description: 'Removes gap and merges borders between adjacent buttons.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<ButtonGroup>
  <Button variant="primary">Save</Button>
  <Button variant="outline">Cancel</Button>
</ButtonGroup>`,
    },
    {
      title: 'Attached',
      code: `<ButtonGroup attached>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>`,
    },
    {
      title: 'Vertical',
      code: `<ButtonGroup orientation="vertical">
  <Button variant="outline">Option A</Button>
  <Button variant="outline">Option B</Button>
  <Button variant="outline">Option C</Button>
</ButtonGroup>`,
    },
  ],
};

export default entry;
