import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'scroll-area',
    title: 'ScrollArea',
    description: 'Scrollable container with custom styled scrollbars.',
    category: 'Disclosure',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'type', type: "'auto' | 'always' | 'scroll' | 'hover'", default: "'hover'", required: false, description: 'Controls when the scrollbar is visible. "hover" shows it on mouse-over, "scroll" while scrolling, "always" always, "auto" when content overflows.' },
    { name: 'scrollHideDelay', type: 'number', default: '600', required: false, description: 'Milliseconds before the scrollbar hides after the user stops interacting (only applies to types "scroll" and "hover").' },
    { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", default: "'vertical'", required: false, description: 'Which axis(es) to make scrollable.' },
    { name: 'className', type: 'string', required: false, description: 'Additional CSS class names applied to the viewport wrapper.' },
    { name: 'style', type: 'React.CSSProperties', required: false, description: 'Inline styles applied to the viewport wrapper.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<ScrollArea style={{ height: '200px', width: '280px', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
  {Array.from({ length: 20 }, (_, i) => (
    <div key={i} style={{ padding: '4px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
      Item {i + 1}
    </div>
  ))}
</ScrollArea>`,
    },
    {
      title: 'Horizontal',
      code: `<ScrollArea orientation="horizontal" style={{ width: '320px', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
  <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
    {Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        style={{
          width: '80px',
          height: '80px',
          background: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
          flexShrink: 0,
        }}
      >
        Card {i + 1}
      </div>
    ))}
  </div>
</ScrollArea>`,
    },
  ],
};

export default entry;
