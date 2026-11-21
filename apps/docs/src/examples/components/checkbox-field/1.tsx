'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { CheckboxGroupField } from '@nexub/react';

export default function Example() {
  const [value, setValue] = React.useState<string[]>(['email']);
  return (
    <CheckboxGroupField
      label="Notify me by"
      description="Pick one or more"
      required
      options={[
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS', description: 'Carrier rates apply' },
        { value: 'push', label: 'Push', disabled: true },
      ]}
      value={value}
      onValueChange={setValue}
      error={value.length ? undefined : 'Pick at least one'}
    />
  );
}
