'use client'; // docs preview: server pages import every example

import { Accordion, Code } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-[480px]">
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="a">
          <Accordion.Trigger>What is Nexub?</Accordion.Trigger>
          <Accordion.Content>A design system for ambitious SaaS teams, built on tokens and accessibility.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger>How do I install?</Accordion.Trigger>
          <Accordion.Content>Run: <Code>pnpm add @nexub/react</Code></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="c">
          <Accordion.Trigger>Is it open source?</Accordion.Trigger>
          <Accordion.Content>Yes — MIT licensed and free to use.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
