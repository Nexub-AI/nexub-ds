# Citation

Numbered source markers for running text, with a hover preview, plus SourceChip and SourceList for the sources under a reply.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { Citation } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/citation

## When to use

- Assistant answers built from retrieved documents or web results.
- SourceList under the reply, so sources are reachable without hovering.

## When not to use

- Ordinary links in prose: use Link.
- Footnotes in static content, where a numbered list at the end of the page is enough.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` (required) | `number` |  | Citation: 1-based number shown in the marker. |
| `source` (required) | `CitationSource` |  | Citation and SourceChip: `{ title, url, domain?, snippet?, favicon? }`. |
| `source.url` (required) | `string` |  | Linked only if it is http or https. Anything else (javascript:, data:, relative) renders as plain text. |
| `source.domain` | `string` |  | Shown instead of the URL’s hostname. |
| `source.snippet` | `string` |  | Quoted text shown in the hover preview. |
| `source.favicon` | `string` |  | http(s) image URL. Falls back to the domain’s first letter. |
| `SourceList sources` (required) | `CitationSource[]` |  | Rendered as SourceChips under a "Sources" heading. Scrolls sideways when narrow, wraps from 480px. |
| `messages` | `Partial<CitationMessages>` |  | Citation and SourceList: overrides for `sources` and `source(index)`. |
| `safeUrl(url)` | `(url?: string) => string \| undefined` |  | The same http(s) check, exported for your own links. |

## Example: Cited answer

Hover or focus a number to preview its source.

```tsx
import { Citation, SourceList, type CitationSource } from '@nexub/react';

const CITATION_SOURCES: CitationSource[] = [
  { title: 'Choosing a heat pump', url: 'https://example.com/guides/heat-pumps', snippet: 'Air-source pumps suit most homes with a garden or outside wall.' },
  { title: 'Grants for home heating', url: 'https://example.org/grants', domain: 'example.org' },
  { title: 'Running costs compared', url: 'https://example.net/costs' },
];

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch max-w-[560px]">
      <p>
        Most homes can use an air-source heat pump<Citation index={1} source={CITATION_SOURCES[0]!} />. Grants cover
        part of the cost<Citation index={2} source={CITATION_SOURCES[1]!} />, and running costs are close to gas
        <Citation index={3} source={CITATION_SOURCES[2]!} />.
      </p>
      <SourceList sources={CITATION_SOURCES} />
    </div>
  );
}
```

## Accessibility

- Roles: link (marker and chips), region (SourceList, named by its heading)
- `Tab`: Focuses a marker and opens its preview.
- `Enter`: Opens the source in a new tab.
- Markers are named "Source 1: <title>", not just the number.
- The hover preview repeats the marker’s information; nothing in it is only available on hover.
- Links open in a new tab with `rel="noopener noreferrer"`; favicons load with `referrerPolicy="no-referrer"`.

Related: [message-bubble](message-bubble.md), [hover-card](hover-card.md), [link](link.md)
