import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'genui',
    title: 'GenUI',
    description:
      'Renders the UI an agent returns as JSON (cards, tables, badges, alerts, buttons) with Nexub components, safely: validated before render, an allow-list of components and props, no HTML, actions by name. From `@nexub/genui`.',
    category: 'AI',
    package: '@nexub/genui',
    status: 'alpha',
    addedIn: '12.8.0',
    related: ['streaming-text', 'message-bubble', 'card', 'table'],
    webOnly: 'The schema is platform-neutral, but 12.8 ships the web renderer only (RFC #823). Until a native renderer exists, show the message’s text answer on phones.',
  },
  usage: {
    whenToUse: [
      'An agent’s answer is better as a small piece of UI than as prose: a summary card, a table of records, a choice between two plans.',
      'Several products need the same format and the same safety checks for model output.',
      'Servers and MCP agents that check a document before storing or returning it: `validate()` from `@nexub/genui/schema` has no React.',
    ],
    whenNotToUse: [
      'Prose answers: use StreamingText, or Markdown parsed to React elements by your own code.',
      'Forms and fields: not in the v1 catalog (they come in v1.1, after their own review).',
      'UI the app itself defines: build it with the components directly; GenUI is for output you don’t trust.',
    ],
  },
  props: [
    { name: 'document', type: 'GenUIDocument | string', required: true, description: 'The document, or its JSON text (partial while `streaming`). Nothing renders before it passes `validate()`.' },
    { name: 'actions', type: 'readonly string[]', default: '[]', description: 'Action names the host accepts. A Button whose action isn’t listed is removed, so the model can’t invent capabilities.' },
    { name: 'onAction', type: '({ name, payload, key }) => void | Promise', description: 'Called once per press. Treat `payload` as untrusted input. Return a promise to show the button busy until it settles.' },
    { name: 'streaming', type: 'boolean', default: 'false', description: 'More JSON is coming: `aria-busy`, a skeleton for each node still arriving, buttons disabled. "Answer ready" is announced once when it ends.' },
    { name: 'catalog', type: 'GenUICatalog', description: 'Narrow the allow-list: `catalog.only([\'Card\', \'Table\'])` or `catalog.without([\'Button\'])`. It can never add components or props.' },
    { name: 'onInvalid', type: "'drop' | 'reject'", default: "'drop'", description: '`drop` removes what is invalid and renders the rest. `reject` shows `fallback` on any issue. Limits, non-JSON and forbidden keys always reject.' },
    { name: 'onIssues', type: '(issues: GenUIIssue[]) => void', description: 'Issues of a finished document, each with a JSON Pointer path, to log or send back to the agent.' },
    { name: 'limits', type: 'Partial<GenUILimits>', description: 'Lower the caps: depth 16, 500 nodes, 256 kB. Higher values are ignored.' },
    { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'Heading level of a top-level Card title; nested cards go one level down.' },
    { name: 'fallback', type: 'ReactNode', description: 'Shown when the document is rejected. Default: an ErrorState, "This answer couldn’t be shown".' },
    { name: 'aria-label', type: 'string', description: 'Names the region. Default: the document’s `title`, else "Generated answer".' },
  ],
  examples: [
    {
      title: 'An answer with every catalog component',
      description:
        'One document: a Card with a Badge, StreamingText, a DescriptionList, a Table, an Alert and a Button. Only `choosePlan` is accepted, so the "Delete account" button the document also asks for is removed. Press "Choose Team".',
    },
    {
      title: 'Streaming JSON text',
      description:
        'Pass the text as it arrives with `streaming`. Nodes still arriving show a skeleton, text grows in place, and the button stays disabled until the whole document has passed validation.',
    },
    {
      title: 'A hostile answer',
      description:
        'Markup stays text, the `script` node and the `className`, `style` and `onClick` props are removed, and the invented `transferAll` button is dropped. The list shows the issues `validate()` returns, with JSON Pointer paths an agent can fix.',
    },
  ],
  a11y: {
    roles: [
      'region, named by `aria-label`, the document title or "Generated answer": screen-reader users know where the generated answer starts and ends',
      'Each part is the @nexub/react component, with its own roles (heading, table, alert, button)',
      'status (polite), for the one "Answer ready" announcement',
    ],
    keyboard: [{ key: 'Tab / Enter / Space', description: 'Buttons are ordinary Nexub buttons; GenUI adds no keyboard handling of its own.' }],
    focus: ['Rendering and streaming never move focus.', 'Keyed nodes keep their identity while later siblings stream in, so nothing remounts or loses focus.'],
    screenReader: [
      'While streaming the region is `aria-busy`; when it ends, one polite "Answer ready" replaces per-token chatter.',
      'Labels the components need are required by the schema (Button `label`, Table column headers); a node without one is removed, never rendered unlabelled.',
      'Card titles are headings, shifted by `headingLevel` and clamped to 1–6 so they fit the page’s outline.',
    ],
    notes: [
      'Every string is a text node: HTML, Markdown and URLs in a document show as typed, never as markup or links.',
      'Strings (region name, "Answer ready", the fallback) translate through NexubProvider messages: `genuiRegion`, `genuiReady`, `genuiFallback`.',
    ],
  },
};

export default entry;
