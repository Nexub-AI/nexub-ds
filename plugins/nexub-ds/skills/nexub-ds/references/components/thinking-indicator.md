# Thinking Indicator

Shows the assistant is working before the first token arrives: a morphing shape and a shimmering label.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { ThinkingIndicator } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/thinking-indicator

## When to use

- The gap between sending a prompt and the first token of the reply.
- Tool calls or retrieval steps inside a reply, with a label naming the step.

## When not to use

- Once text is streaming: StreamingText’s caret already shows progress. Replace the indicator, don’t stack them.
- General loading outside AI surfaces: use Spinner or Skeleton.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode \| null` | `messages.thinking ('Thinking')` | Visible text. `null` hides it; "Thinking" is still announced. |
| `size` | `'sm' \| 'md'` | `'md'` | Shape and text size. |
| `messages` | `Partial<{ thinking: string }>` |  | Local override for the default text. |

## Example: Default

```tsx
<ThinkingIndicator />
```

## Example: Custom label and sizes

Name the step when you know it. `label={null}` keeps only the shape.

```tsx
<ThinkingIndicator label="Searching 4 sources" />
<ThinkingIndicator size="sm" />
<ThinkingIndicator size="sm" label={null} />
```

## Accessibility

- Roles: status
- A polite live region: the label is announced once when it mounts. Changing the label announces the new step.
- Render it only while waiting and remove it when tokens start, so it is not announced again.
- With reduced motion the shape and shimmer are static.

Related: [streaming-text](streaming-text.md), [spinner](spinner.md), [conversation](conversation.md)
