# InfoList

Key–value list for displaying structured metadata or details.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { InfoList } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/info-list

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | The key label. |
| `value` (required) | `React.ReactNode` |  | The displayed value. |

## Example: Default

```tsx
<InfoList.Root>
  <InfoList.Item label="Plan" value="Pro" />
  <InfoList.Item label="Status" value={<Badge tone="success">Active</Badge>} />
  <InfoList.Item label="Member since" value="Jan 2024" />
  <InfoList.Item label="Team size" value="12 members" />
</InfoList.Root>
```
