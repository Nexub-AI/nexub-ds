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
import { ActivityFeed } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[340px]">
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Sarah K. created an invoice" description="Invoice #1042 for Acme Corp" timestamp="2 min ago" />
        <ActivityFeed.Item title="James L. approved a request" description="Budget increase for Q2" timestamp="15 min ago" />
        <ActivityFeed.Item title="Maria R. added a comment" description="On the design review document" timestamp="1 hr ago" />
      </ActivityFeed.Root>
    </div>
  );
}
```
