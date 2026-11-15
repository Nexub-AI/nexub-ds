'use client'; // docs preview: server pages import every example

import { Accordion } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-[480px]">
      <Accordion.Root type="multiple">
        <Accordion.Item value="x">
          <Accordion.Trigger>Section A</Accordion.Trigger>
          <Accordion.Content>Content for section A — stays open when B is opened.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="y">
          <Accordion.Trigger>Section B</Accordion.Trigger>
          <Accordion.Content>Content for section B — multiple can be open at once.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
