import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-scale',
    title: 'Scale',
    description: 'Scales content in/out from its center.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'in', type: 'boolean', required: true, description: 'When true, scales content in from 0 to 1. When false, scales it back down to 0.' },
    { name: 'duration', type: "'instant' | 'fast' | 'normal' | 'slow' | 'slower'", default: "'normal'", required: false, description: 'Controls the animation speed using the design token scale.' },
    { name: 'easing', type: "'linear' | 'in' | 'out' | 'in-out' | 'out-expo' | 'spring'", default: "'out'", required: false, description: 'Easing curve applied to the animation.' },
    { name: 'unmountOnExit', type: 'boolean', default: 'false', required: false, description: 'Removes the element from the DOM after the exit animation completes.' },
    { name: 'as', type: 'React.ElementType', default: "'div'", required: false, description: 'The HTML element or component to render as the wrapper.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to animate.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Scale in={true}>
  <Card>Scaled content</Card>
</Scale>`,
    },
    {
      title: 'Toggle',
      code: `function ScaleToggle() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Scale out' : 'Scale in'}
      </Button>
      <Scale in={visible} duration="fast" easing="spring" unmountOnExit>
        <div
          style={{
            padding: '24px',
            background: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}
        >
          Pop!
        </div>
      </Scale>
    </div>
  );
}`,
    },
  ],
};

export default entry;
