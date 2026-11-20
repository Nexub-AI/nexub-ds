'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { FormField, PhoneInput } from '@nexub/react';

export default function Example() {
  const [valid, setValid] = React.useState(true);
  return (
    <FormField.Root name="mobile" required invalid={!valid} className="w-80 max-w-full">
      <FormField.Label>Mobile number</FormField.Label>
      <FormField.Control>
        <PhoneInput countries={['IN', 'AE', 'SA', 'QA']} sheet="auto" onValueChange={(e164, details) => setValid(!e164 || details.valid)} />
      </FormField.Control>
      <FormField.Description>We send a code to confirm it.</FormField.Description>
      <FormField.Error>That number looks too short or too long.</FormField.Error>
    </FormField.Root>
  );
}
