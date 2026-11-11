# InfoList

Key–value list for displaying structured metadata or details.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { InfoList } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/info-list

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `InfoListItem label` (required) | `string` |  | The key label. |
| `value` (required) | `React.ReactNode` |  | The displayed value. |

## Example: Default

```tsx
import { InfoList } from '@nexub/patterns';
import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[280px]">
      <InfoList.Root>
        <InfoList.Item label="Plan" value="Pro" />
        <InfoList.Item label="Seats" value="12 / 50" />
        <InfoList.Item label="Renewal" value="Jan 15, 2026" />
        <InfoList.Item label="Status" value={<Badge tone="success" size="sm">Active</Badge>} />
      </InfoList.Root>
    </div>
  );
}
```
