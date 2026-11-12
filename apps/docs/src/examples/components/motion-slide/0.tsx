'use client'; // docs preview: server pages import every example

import { Slide, Card, Text } from '@nexub/react';

export default function Example() {
  return <Slide in direction="up"><Card className="w-[200px]"><Text size="body-sm">Slid in from bottom</Text></Card></Slide>;
}
