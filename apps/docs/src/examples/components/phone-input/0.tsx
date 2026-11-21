'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { PhoneInput } from '@nexub/react';

export default function Example() {
  const [value, setValue] = React.useState('');
  const [valid, setValid] = React.useState(false);
  return (
    <div className="flex w-80 max-w-full flex-col gap-2">
      <PhoneInput
        aria-label="Phone number"
        defaultCountry="IN"
        value={value}
        onValueChange={(e164, details) => {
          setValue(e164);
          setValid(details.valid);
        }}
      />
      <p aria-live="polite" className="text-body-sm text-on-surface-muted">
        {value ? `${value}${valid ? '' : ' (incomplete)'}` : 'Type a number, or paste one with its country code'}
      </p>
    </div>
  );
}
