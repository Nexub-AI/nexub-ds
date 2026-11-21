# ActivityFeed

Chronological list of activity events with avatar, description, and timestamp.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { ActivityFeed } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/activity-feed

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ActivityFeedItem title` (required) | `React.ReactNode` |  | Activity event title. Block content is fine (a `div` since 11.5). |
| `ActivityFeedItem description` | `React.ReactNode` |  | Supporting description. Block content is fine (a `div` since 11.5). |
| `ActivityFeedItem timestamp` | `ReactNode \| Date` |  | Text as given (e.g. "2 hours ago"), or (11.5) a `Date`: shown in `<time dateTime>` as relative text, a short date after a week, with the full date in a tooltip on hover or focus. |
| `ActivityFeedItem actions` | `React.ReactNode` |  | 11.5. Trailing controls, e.g. an IconButton or a menu trigger. |
| `ActivityFeedItem tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` |  | 11.5. A coloured dot in place of the avatar, or a badge on it. Decorative: say what happened in the title. |
| `ActivityFeedGroup label` (required) | `React.ReactNode` |  | 11.5. `ActivityFeed.Group` header, e.g. "Today"; it names the group’s list. |
| `ActivityFeedGroup headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` |  | 11.5. Renders the header as a heading for heading navigation. Default: a plain `div`. |
| `ActivityFeedItem avatar` | `React.ReactNode` |  | Avatar element for the actor. |

## Example: Default

```tsx
import { ActivityFeed } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-85">
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Sarah K. created an invoice" description="Invoice #1042 for Acme Corp" timestamp="2 min ago" />
        <ActivityFeed.Item title="James L. approved a request" description="Budget increase for Q2" timestamp="15 min ago" />
        <ActivityFeed.Item title="Maria R. added a comment" description="On the design review document" timestamp="1 hr ago" />
      </ActivityFeed.Root>
    </div>
  );
}
```

## Example: Groups, tones and actions

`ActivityFeed.Group` headers, `Date` timestamps (focus one for the full date), `tone` dots and a menu per item.

```tsx
import { ActivityFeed } from '@nexub/patterns';
import { IconButton } from '@nexub/react';
import { MoreHorizontal } from '@nexub/icons';

export default function Example() {
  const minutesAgo = (n: number) => new Date(Date.now() - n * 60_000);
  const more = (
    <IconButton size="xs" label="More actions">
      <MoreHorizontal className="size-4" aria-hidden="true" />
    </IconButton>
  );
  return (
    <div className="w-full max-w-md">
      <ActivityFeed.Root>
        <ActivityFeed.Group label="Today">
          <ActivityFeed.Item tone="success" title="Deploy to production finished" timestamp={minutesAgo(5)} actions={more} />
          <ActivityFeed.Item tone="danger" title="Contacts import failed" description="Row 12 is missing an email." timestamp={minutesAgo(42)} actions={more} />
        </ActivityFeed.Group>
        <ActivityFeed.Group label="Yesterday">
          <ActivityFeed.Item tone="info" title="Maria R. joined the workspace" timestamp={minutesAgo(26 * 60)} />
        </ActivityFeed.Group>
      </ActivityFeed.Root>
    </div>
  );
}
```
