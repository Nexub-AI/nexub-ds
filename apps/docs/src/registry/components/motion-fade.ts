import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-fade',
    title: 'Fade',
    description: 'Animates opacity between 0 and 1 based on the `in` prop.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'in', type: 'boolean', required: true, description: 'When true, fades content in. When false, fades it out.' },
    { name: 'duration', type: "'instant' | 'fast' | 'normal' | 'slow' | 'slower'", default: "'normal'", required: false, description: 'Controls the animation speed using the design token scale.' },
    { name: 'easing', type: "'linear' | 'in' | 'out' | 'in-out' | 'out-expo' | 'spring'", default: "'out'", required: false, description: 'Easing curve applied to the animation.' },
    { name: 'unmountOnExit', type: 'boolean', default: 'false', required: false, description: 'Removes the element from the DOM after the exit animation completes.' },
    { name: 'as', type: 'React.ElementType', default: "'div'", required: false, description: 'The HTML element or component to render as the wrapper.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to animate.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Fade in={true}>
  <Card>Faded in content</Card>
</Fade>`,
    },
    {
      title: 'Toggle',
      code: `function FadeToggle() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Fade out' : 'Fade in'}
      </Button>
      <Fade in={visible} duration="normal" easing="out" unmountOnExit>
        <Card style={{ padding: '16px' }}>
          This content fades in and out. Toggle the button to animate it.
        </Card>
      </Fade>
    </div>
  );
}`,
    },
    {
      title: 'Slow with spring easing',
      code: `function SlowFade() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <Fade in={visible} duration="slow" easing="spring">
        <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          Slow spring fade animation.
        </div>
      </Fade>
    </div>
  );
}`,
    },
  ],
};

export default entry;
