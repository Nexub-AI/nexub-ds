# Accordion

Vertically stacked list of collapsible sections.

- Package: `@nexub/react` · Category: Disclosure · Status: stable
- Import: `import { Accordion } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/accordion

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Accordion.Root type` | `'single' \| 'multiple'` | `'single'` | Whether one or multiple items can be open at the same time. |
| `Accordion.Root collapsible` | `boolean` | `false` | When type is "single", allows the open item to be collapsed by clicking it again. |
| `Accordion.Root defaultValue` | `string \| string[]` |  | The item(s) open by default (uncontrolled). |
| `Accordion.Root value` | `string \| string[]` |  | Controlled open item(s). |
| `Accordion.Root onValueChange` | `(value: string \| string[]) => void` |  | Callback fired when the open state changes. |
| `Accordion.Root disabled` | `boolean` | `false` | Disables all items in the accordion. |
| `Accordion.Item value` (required) | `string` |  | Unique identifier for the item. |
| `Accordion.Item disabled` | `boolean` | `false` | Disables this specific item. |
| `Accordion.Trigger asChild` | `boolean` | `false` | Merges props onto the immediate child element. |
| `Accordion.Content forceMount` | `boolean` | `false` | Keeps content in the DOM even when collapsed. |

## Example: Default

```tsx
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
```

## Example: Multiple

```tsx
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
```
