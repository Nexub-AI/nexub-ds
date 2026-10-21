# StatCard

Metric display card showing a KPI value, label, optional delta, and icon.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { StatCard } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/stat-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Metric name label. |
| `value` (required) | `React.ReactNode` |  | Primary metric value. |
| `delta` | `string` |  | Change value (e.g. "+12.5%"). |
| `deltaType` | `'increase' \| 'decrease' \| 'neutral'` |  | Semantic direction of the delta. |
| `icon` | `React.ReactNode` |  | Icon displayed in the card header. |
| `description` | `string` |  | Additional context below the value. |

## Example: Default

```tsx
<StatCard
  label="Total Revenue"
  value="$48,295"
  delta="+12.5%"
  deltaType="increase"
  description="vs last month"
/>
```

## Example: With icon

```tsx
<StatCard
  label="Active Users"
  value="2,841"
  delta="-3.2%"
  deltaType="decrease"
  icon={<Users size={20} />}
/>
```
