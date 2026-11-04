import { DatePicker } from '@nexub/react';

export default function Example() {
  return (
    <DatePicker
      aria-label="Schedule for"
      placeholder="Select a future date…"
      minDate={new Date()}
      maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
    />
  );
}
