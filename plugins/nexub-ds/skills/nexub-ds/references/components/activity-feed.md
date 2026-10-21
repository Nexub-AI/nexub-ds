# ActivityFeed

Chronological list of activity events with avatar, description, and timestamp.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { ActivityFeed } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/activity-feed

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `React.ReactNode` |  | Activity event title. |
| `description` | `React.ReactNode` |  | Supporting description. |
| `timestamp` | `string` |  | Time string (e.g. "2 hours ago"). |
| `avatar` | `React.ReactNode` |  | Avatar element for the actor. |

## Example: Default

```tsx
<ActivityFeed.Root>
  <ActivityFeed.Item
    title="Alex created a new project"
    description="Project 'Nexub DS v2' was created"
    timestamp="2 hours ago"
  />
  <ActivityFeed.Item
    title="Sam invited 3 members"
    description="Jordan, Riley, and Taylor joined"
    timestamp="Yesterday"
  />
</ActivityFeed.Root>
```
