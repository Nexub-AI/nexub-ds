# Description List

Key–value rows with list semantics: a receipt, a fee breakdown, the details of a record.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { DescriptionList } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/description-list

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `Root layout` | `'inline' \| 'stacked'` | `'inline'` | Label and value on one row, or label above the value. |
| `Root columns` | `1 \| 2 \| 3` | `1` | Pairs per row. Falls back to fewer columns when the list itself is narrow. |
| `Root divided` | `boolean` |  | A hairline between rows. |
| `Root size` | `'sm' \| 'md'` | `'md'` | Row height and type size. |
| `Item label` (required) | `React.ReactNode` |  | The term. |
| `Item children` | `React.ReactNode` |  | The value. |
| `Item emphasis` | `boolean` |  | A total: stronger label and value, and a rule above. |
| `Item align` | `'start' \| 'end'` |  | Where the value sits. Defaults to the end when inline, the start when stacked. |
| `Item helpText` | `React.ReactNode` |  | A small muted line under the label. |

## Example: Receipt with a total

```tsx
import { DescriptionList } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <DescriptionList.Root divided aria-label="Order summary">
        <DescriptionList.Item label="Subtotal" helpText="2 items">$40.00</DescriptionList.Item>
        <DescriptionList.Item label="Shipping">$5.00</DescriptionList.Item>
        <DescriptionList.Item label="Service fee">$1.50</DescriptionList.Item>
        <DescriptionList.Item label="Total" emphasis>$46.50</DescriptionList.Item>
      </DescriptionList.Root>
    </div>
  );
}
```

## Example: Stacked, in columns

```tsx
import { DescriptionList } from '@nexub/react';

export default function Example() {
  return (
    <DescriptionList.Root layout="stacked" columns={3}>
      <DescriptionList.Item label="Applicant">Ada Lovelace</DescriptionList.Item>
      <DescriptionList.Item label="Submitted">12 March 2026</DescriptionList.Item>
      <DescriptionList.Item label="Reference">APP-2041</DescriptionList.Item>
      <DescriptionList.Item label="Plan">Standard</DescriptionList.Item>
      <DescriptionList.Item label="Reviewer">Not assigned</DescriptionList.Item>
      <DescriptionList.Item label="Status">Under review</DescriptionList.Item>
    </DescriptionList.Root>
  );
}
```

Related: [info-list](info-list.md), [table](table.md)
