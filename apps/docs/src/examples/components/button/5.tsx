'use client'; // docs preview: server pages import every example

import { Button } from '@nexub/react';
import { ArrowRight } from '@nexub/icons';

export default function Example() {
  return (
    <div data-mode="marketing" className="flex flex-wrap items-center gap-3">
      <Button variant="hero" size="lg" trailingIcon={<ArrowRight size={16} />}>Start free</Button>
      <Button variant="outlined" size="lg">Book a demo</Button>
    </div>
  );
}
