import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'motion-collapse',
    title: 'Collapse',
    description: 'Expands and collapses content along the block axis.',
    category: 'Motion',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'in', type: 'boolean', required: true, description: 'When true, expands the content to its natural height. When false, collapses it to zero height.' },
    { name: 'duration', type: "'instant' | 'fast' | 'normal' | 'slow' | 'slower'", default: "'normal'", required: false, description: 'Controls the animation speed using the design token scale.' },
    { name: 'easing', type: "'linear' | 'in' | 'out' | 'in-out' | 'out-expo' | 'spring'", default: "'out'", required: false, description: 'Easing curve applied to the animation.' },
    { name: 'unmountOnExit', type: 'boolean', default: 'false', required: false, description: 'Removes the element from the DOM after the collapse animation completes.' },
    { name: 'as', type: 'React.ElementType', default: "'div'", required: false, description: 'The HTML element or component to render as the wrapper.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Content to expand and collapse.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Collapse in={true}>
  <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
    Collapsed content
  </div>
</Collapse>`,
    },
    {
      title: 'Toggle',
      code: `function CollapseToggle() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Button variant="outline" onClick={() => setOpen((o) => !o)}>
        {open ? 'Collapse' : 'Expand'}
      </Button>
      <Collapse in={open} unmountOnExit>
        <div
          style={{
            padding: '16px',
            background: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          This section smoothly expands and collapses along the vertical axis.
          It preserves the natural document flow by animating the block size.
        </div>
      </Collapse>
    </div>
  );
}`,
    },
  ],
};

export default entry;
