# List Detail

The list-detail layout: side by side at 720px+ of its own width (a container query), one pane at a time below.

- Package: `@nexub/patterns` · Category: Layout · Status: beta
- Import: `import { ListDetail } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/list-detail

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `list / detail` (required) | `ReactNode` |  | The two panes. |
| `showDetail` | `boolean` | `false` | When narrow, show the detail instead of the list (set it on selection). |
| `onBack` | `() => void` |  | Back button, shown only when narrow. |
| `listWidth` | `'sm' \| 'md' \| 'lg'` | `'md'` | Fixed list width when both panes show (288 / 320 / 400px). |

## Example: Default

```tsx
<ListDetail
  showDetail={selected !== null}
  onBack={() => setSelected(null)}
  list={<MessageList onSelect={setSelected} />}
  detail={<Message id={selected} />}
/>
```
