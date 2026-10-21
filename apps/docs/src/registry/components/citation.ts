import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'citation',
    title: 'Citation',
    description: 'Numbered source markers for running text, with a hover preview, plus SourceChip and SourceList for the sources under a reply.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.8.0',
    related: ['message-bubble', 'hover-card', 'link'],
  },
  props: [
    { name: 'index', type: 'number', required: true, description: 'Citation: 1-based number shown in the marker.' },
    { name: 'source', type: 'CitationSource', required: true, description: 'Citation and SourceChip: `{ title, url, domain?, snippet?, favicon? }`.' },
    { name: 'source.url', type: 'string', required: true, description: 'Linked only if it is http or https. Anything else (javascript:, data:, relative) renders as plain text.' },
    { name: 'source.domain', type: 'string', required: false, description: 'Shown instead of the URL’s hostname.' },
    { name: 'source.snippet', type: 'string', required: false, description: 'Quoted text shown in the hover preview.' },
    { name: 'source.favicon', type: 'string', required: false, description: 'http(s) image URL. Falls back to the domain’s first letter.' },
    { name: 'SourceList sources', type: 'CitationSource[]', required: true, description: 'Rendered as SourceChips under a "Sources" heading. Scrolls sideways when narrow, wraps from 480px.' },
    { name: 'messages', type: 'Partial<CitationMessages>', required: false, description: 'Citation and SourceList: overrides for `sources` and `source(index)`.' },
    { name: 'safeUrl(url)', type: '(url?: string) => string | undefined', required: false, description: 'The same http(s) check, exported for your own links.' },
  ],
  examples: [
    {
      title: 'Cited answer',
      description: 'Hover or focus a number to preview its source.',
      code: `const sources: CitationSource[] = [
  { url: 'https://example.com/guides/heat-pumps', title: 'Choosing a heat pump', snippet: 'Air-source pumps suit most homes with a garden or outside wall.' },
  { url: 'https://example.org/grants', title: 'Grants for home heating', domain: 'example.org' },
  { url: 'https://example.net/costs', title: 'Running costs compared' },
];

<p>
  Most homes can use an air-source heat pump<Citation index={1} source={sources[0]} />.
  Grants cover part of the cost<Citation index={2} source={sources[1]} />, and running
  costs are close to gas<Citation index={3} source={sources[2]} />.
</p>
<SourceList sources={sources} />`,
    },
  ],
  usage: {
    whenToUse: [
      'Assistant answers built from retrieved documents or web results.',
      'SourceList under the reply, so sources are reachable without hovering.',
    ],
    whenNotToUse: [
      'Ordinary links in prose: use Link.',
      'Footnotes in static content, where a numbered list at the end of the page is enough.',
    ],
  },
  a11y: {
    roles: ['link (marker and chips)', 'region (SourceList, named by its heading)'],
    keyboard: [
      { key: 'Tab', description: 'Focuses a marker and opens its preview.' },
      { key: 'Enter', description: 'Opens the source in a new tab.' },
    ],
    screenReader: [
      'Markers are named "Source 1: <title>", not just the number.',
      'The hover preview repeats the marker’s information; nothing in it is only available on hover.',
    ],
    notes: [
      'Links open in a new tab with `rel="noopener noreferrer"`; favicons load with `referrerPolicy="no-referrer"`.',
    ],
  },
};

export default entry;
