'use client';

import * as React from 'react';
// Registers <nx-number-input> and <nx-date-picker>. On a page without a bundler, use
// <script type="module" src="…/@nexub/elements/dist/define.js"></script> instead.
import '@nexub/elements/define';

export default function Example() {
  const ref = React.useRef<HTMLElementTagNameMap['nx-number-input']>(null);
  const [value, setValue] = React.useState('4');
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onChange = () => setValue(el.value);
    el.addEventListener('change', onChange);
    return () => el.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <label htmlFor="seats" className="text-label-lg text-on-surface">
        Seats
      </label>
      <nx-number-input ref={ref} id="seats" name="seats" min="1" max="50" step="1" value="4" placeholder="1–50" />
      <p className="text-body-sm text-on-surface-muted">Committed value: {value === '' ? 'empty' : value}</p>
    </div>
  );
}
