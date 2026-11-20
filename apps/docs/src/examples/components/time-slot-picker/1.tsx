'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { FormField, TimeSlotPicker } from '@nexub/react';

const slots = ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'].map((value) => ({
  value,
  disabled: value === '13:00',
}));

export default function Example() {
  return (
    <FormField.Root name="time" className="w-96 max-w-full">
      <FormField.Control>
        <TimeSlotPicker aria-label="Appointment time" slots={slots} groupBy="period" columns={3} />
      </FormField.Control>
      <FormField.Description>Times are shown in the venue’s time zone.</FormField.Description>
    </FormField.Root>
  );
}
