'use client';

import * as React from 'react';
// Registers <nx-number-input> and <nx-date-picker>. On a page without a bundler, use
// <script type="module" src="…/@nexub/elements/dist/define.js"></script> instead.
import '@nexub/elements/define';

export default function Example() {
  const ref = React.useRef<HTMLElementTagNameMap['nx-date-picker']>(null);
  const [value, setValue] = React.useState('2026-03-14');
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = () => setValue(el.value);
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, []);

  return (
    <div lang="en-US" className="flex w-full max-w-xs flex-col gap-2">
      <label htmlFor="start" className="text-label-lg text-on-surface">
        Start date
      </label>
      <nx-date-picker ref={ref} id="start" name="start" min="2026-01-01" max="2026-12-31" value="2026-03-14" />
      <p className="text-body-sm text-on-surface-muted">Value: {value || 'empty'}</p>
    </div>
  );
}
