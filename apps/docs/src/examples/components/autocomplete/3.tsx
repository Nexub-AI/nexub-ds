'use client';

import * as React from 'react';
import { Autocomplete } from '@nexub/react';

const all = ['Amsterdam', 'Berlin', 'Lisbon', 'London', 'Madrid', 'Paris', 'Singapore', 'Tokyo'];

// Fetch-as-you-type: onInputChange turns built-in filtering off.
export default function Example() {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState(all.map((c) => ({ value: c, label: c })));
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const q = query.toLowerCase();
      setOptions(all.filter((c) => c.toLowerCase().includes(q)).map((c) => ({ value: c, label: c })));
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);
  return (
    <div className="w-[280px]">
      <Autocomplete
        aria-label="City"
        placeholder="Search cities…"
        options={options}
        loading={loading}
        onInputChange={setQuery}
      />
    </div>
  );
}
