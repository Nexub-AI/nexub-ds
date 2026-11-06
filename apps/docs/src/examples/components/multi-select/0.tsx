'use client';

import * as React from 'react';
import { MultiSelect } from '@nexub/react';

const labels = [
  { value: 'bug', label: 'Bug' },
  { value: 'design', label: 'Design' },
  { value: 'docs', label: 'Docs' },
  { value: 'perf', label: 'Performance' },
  { value: 'a11y', label: 'Accessibility' },
  { value: 'security', label: 'Security' },
];

export default function Example() {
  const [options, setOptions] = React.useState(labels);
  const [value, setValue] = React.useState(['bug', 'a11y']);
  return (
    <div className="w-[320px]">
      <MultiSelect
        aria-label="Labels"
        placeholder="Add labels…"
        options={options}
        value={value}
        onValueChange={setValue}
        onCreate={(text) => {
          const v = text.toLowerCase();
          setOptions((o) => [...o, { value: v, label: text }]);
          setValue((s) => [...s, v]);
        }}
      />
    </div>
  );
}
