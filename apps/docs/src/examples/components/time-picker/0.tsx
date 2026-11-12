'use client'; // docs preview: server pages import every example

import { FormField, TimePicker } from '@nexub/react';

export default function Example() {
  return (
    <FormField.Root name="reminder" className="w-40">
      <FormField.Label>Remind me at</FormField.Label>
      <FormField.Control>
        <TimePicker defaultValue="09:00" minuteStep={15} />
      </FormField.Control>
    </FormField.Root>
  );
}
