import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-slide',
    title: 'Slide',
    description: 'Slides content in from a direction based on the `in` prop.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'in', type: 'boolean', required: true, description: 'When true, slides content in. When false, slides it out.' },
    { name: 'direction', type: "'up' | 'down' | 'left' | 'right'", default: "'up'", required: false, description: 'The direction from which the content slides in.' },
    { name: 'duration', type: "'instant' | 'fast' | 'normal' | 'slow' | 'slower'", default: "'normal'", required: false, description: 'Controls the animation speed using the design token scale.' },
    { name: 'easing', type: "'linear' | 'in' | 'out' | 'in-out' | 'out-expo' | 'spring'", default: "'out'", required: false, description: 'Easing curve applied to the animation.' },
    { name: 'unmountOnExit', type: 'boolean', default: 'false', required: false, description: 'Removes the element from the DOM after the exit animation completes.' },
    { name: 'as', type: 'React.ElementType', default: "'div'", required: false, description: 'The HTML element or component to render as the wrapper.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to animate.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Slide in={true} direction="up">
  <Card>Slid in from bottom</Card>
</Slide>`,
    },
    {
      title: 'Directions',
      code: `function SlideDirections() {
  const [visible, setVisible] = React.useState(true);
  const [direction, setDirection] = React.useState('up');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['up', 'down', 'left', 'right'].map((dir) => (
          <Button
            key={dir}
            variant={direction === dir ? 'primary' : 'outline'}
            size="sm"
            onClick={() => { setDirection(dir); setVisible(true); }}
          >
            {dir}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => setVisible((v) => !v)}>
          Toggle
        </Button>
      </div>
      <Slide in={visible} direction={direction} unmountOnExit>
        <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          Sliding in from {direction}.
        </div>
      </Slide>
    </div>
  );
}`,
    },
  ],
};

export default entry;
