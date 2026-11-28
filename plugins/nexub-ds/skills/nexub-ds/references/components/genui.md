# GenUI

Renders the UI an agent returns as JSON (cards, tables, badges, alerts, buttons) with Nexub components, safely: validated before render, an allow-list of components and props, no HTML, actions by name. From `@nexub/genui`.

- Package: `@nexub/genui` · Category: AI · Status: alpha
- Import: `import { Genui } from '@nexub/genui';`
- Install: `npm install @nexub/genui`. `@nexub/react` is a peer dependency, and its stylesheet styles the answer. Servers import `validate` and the schema from `@nexub/genui/schema` (no React).
- Web only: The schema is platform-neutral, but 12.8 ships the web renderer only (RFC #823). Until a native renderer exists, show the message’s text answer on phones.
- Docs: https://nexub-ds-docs.pages.dev/components/genui

## When to use

- An agent’s answer is better as a small piece of UI than as prose: a summary card, a table of records, a choice between two plans.
- Several products need the same format and the same safety checks for model output.
- Servers and MCP agents that check a document before storing or returning it: `validate()` from `@nexub/genui/schema` has no React.

## When not to use

- Prose answers: use StreamingText, or Markdown parsed to React elements by your own code.
- Forms and fields: not in the v1 catalog (they come in v1.1, after their own review).
- UI the app itself defines: build it with the components directly; GenUI is for output you don’t trust.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `document` (required) | `GenUIDocument \| string` |  | The document, or its JSON text (partial while `streaming`). Nothing renders before it passes `validate()`. |
| `actions` | `readonly string[]` | `[]` | Action names the host accepts. A Button whose action isn’t listed is removed, so the model can’t invent capabilities. |
| `onAction` | `({ name, payload, key }) => void \| Promise` |  | Called once per press. Treat `payload` as untrusted input. Return a promise to show the button busy until it settles. |
| `streaming` | `boolean` | `false` | More JSON is coming: `aria-busy`, a skeleton for each node still arriving, buttons disabled. "Answer ready" is announced once when it ends. |
| `catalog` | `GenUICatalog` |  | Narrow the allow-list: `catalog.only(['Card', 'Table'])` or `catalog.without(['Button'])`. It can never add components or props. |
| `onInvalid` | `'drop' \| 'reject'` | `'drop'` | `drop` removes what is invalid and renders the rest. `reject` shows `fallback` on any issue. Limits, non-JSON and forbidden keys always reject. |
| `onIssues` | `(issues: GenUIIssue[]) => void` |  | Issues of a finished document, each with a JSON Pointer path, to log or send back to the agent. |
| `limits` | `Partial<GenUILimits>` |  | Lower the caps: depth 16, 500 nodes, 256 kB. Higher values are ignored. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level of a top-level Card title; nested cards go one level down. |
| `fallback` | `ReactNode` |  | Shown when the document is rejected. Default: an ErrorState, "This answer couldn’t be shown". |
| `aria-label` | `string` |  | Names the region. Default: the document’s `title`, else "Generated answer". |

## Example: An answer with every catalog component

One document: a Card with a Badge, StreamingText, a DescriptionList, a Table, an Alert and a Button. Only `choosePlan` is accepted, so the "Delete account" button the document also asks for is removed. Press "Choose Team".

```tsx
import * as React from 'react';
import { GenUI, type GenUIActionEvent } from '@nexub/genui';

// What the agent returned. Only catalog components and props render; everything is text.
const answer = {
  version: '1.0',
  title: 'Plans that fit your team',
  root: {
    type: 'Card',
    props: { title: 'Team plan', description: '€8 per seat, monthly', variant: 'surface' },
    children: [
      { type: 'Badge', props: { text: 'Recommended', tone: 'success', variant: 'soft' } },
      { type: 'StreamingText', props: { text: 'Two plans fit a team of 12. Team covers what you use today.' } },
      {
        type: 'DescriptionList',
        props: { items: [{ label: 'Seats', value: '12' }, { label: 'Per seat', value: '€8.00' }, { label: 'Monthly total', value: '€96.00', emphasis: true }] },
      },
      {
        type: 'Table',
        props: {
          caption: 'Compared with Business',
          columns: [{ label: 'Feature' }, { label: 'Team' }, { label: 'Business' }],
          rows: [['SSO', 'No', 'Yes'], ['Audit log', '30 days', '1 year']],
        },
      },
      { type: 'Alert', props: { text: 'Prices exclude VAT.', tone: 'info' } },
      { type: 'Button', key: 'team', props: { label: 'Choose Team', action: { name: 'choosePlan', payload: { plan: 'team' } } } },
      // Not in `actions` below, so it is removed: the model can't invent capabilities.
      { type: 'Button', key: 'delete', props: { label: 'Delete account', tone: 'danger', action: { name: 'deleteAccount' } } },
    ],
  },
};

export default function Example() {
  const [chosen, setChosen] = React.useState<string>();
  // The payload is untrusted input: check it like a request body.
  const onAction = ({ name, payload }: GenUIActionEvent) => {
    const plan = (payload as { plan?: unknown } | undefined)?.plan;
    if (name === 'choosePlan' && (plan === 'team' || plan === 'business')) setChosen(plan);
  };
  return (
    <div className="flex w-full max-w-140 flex-col gap-3">
      <GenUI document={answer} actions={['choosePlan']} onAction={onAction} />
      {chosen && <p className="text-body-sm text-on-surface-variant">The host received choosePlan for the {chosen} plan.</p>}
    </div>
  );
}
```

## Example: Streaming JSON text

Pass the text as it arrives with `streaming`. Nodes still arriving show a skeleton, text grows in place, and the button stays disabled until the whole document has passed validation.

```tsx
import * as React from 'react';
import { Button } from '@nexub/react';
import { GenUI } from '@nexub/genui';

// The JSON text as a model streams it. GenUI parses what has arrived so far.
const json = JSON.stringify({
  version: '1.0',
  title: 'Refund request',
  root: {
    type: 'Card',
    props: { title: 'Refund for order A-1042', description: 'Requested today' },
    children: [
      { type: 'StreamingText', props: { text: 'The customer says the parcel arrived damaged and sent two photos.' } },
      { type: 'DescriptionList', props: { items: [{ label: 'Amount', value: '€42.00' }, { label: 'Paid with', value: 'Card ending 4242' }] } },
      { type: 'Button', props: { label: 'Review refund', variant: 'tonal', action: { name: 'reviewRefund', payload: { orderId: 'A-1042' } } } },
    ],
  },
});

export default function Example() {
  const [length, setLength] = React.useState(0);
  const streaming = length < json.length;
  React.useEffect(() => {
    if (!streaming) return;
    const id = setTimeout(() => setLength((n) => Math.min(json.length, n + 12)), 50);
    return () => clearTimeout(id);
  }, [length, streaming]);
  return (
    <div className="flex w-full max-w-140 flex-col items-start gap-3">
      <div className="w-full">
        <GenUI document={json.slice(0, length)} streaming={streaming} actions={['reviewRefund']} onAction={() => {}} />
      </div>
      <Button variant="outlined" size="sm" onClick={() => setLength(0)}>
        Restart
      </Button>
    </div>
  );
}
```

## Example: A hostile answer

Markup stays text, the `script` node and the `className`, `style` and `onClick` props are removed, and the invented `transferAll` button is dropped. The list shows the issues `validate()` returns, with JSON Pointer paths an agent can fix.

```tsx
import { GenUI } from '@nexub/genui';
import { validate } from '@nexub/genui/schema';

// A hostile answer: markup in text, a script component, escape-hatch props, an invented action.
const hostile = {
  version: '1.0',
  root: {
    type: 'Card',
    props: { title: '<img src=x onerror=alert(1)>', className: 'evil', style: { position: 'fixed' } },
    children: [
      { type: 'script', props: { text: 'alert(1)' } },
      { type: 'Badge', props: { text: 'Paid', tone: 'success', onClick: 'alert(1)' } },
      { type: 'Button', props: { label: 'Transfer funds', action: { name: 'transferAll' } } },
    ],
  },
};

// The same pure check runs on a server (no React) before it stores or forwards a document.
const { issues } = validate(hostile, { actions: ['choosePlan'] });

export default function Example() {
  return (
    <div className="flex w-full max-w-140 flex-col gap-4">
      <GenUI document={hostile} actions={['choosePlan']} />
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-body-sm text-on-surface-variant">
        {issues.map((issue) => (
          <li key={issue.path}>
            <code>{issue.path}</code> {issue.code}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Accessibility

- Roles: region, named by `aria-label`, the document title or "Generated answer": screen-reader users know where the generated answer starts and ends, Each part is the @nexub/react component, with its own roles (heading, table, alert, button), status (polite), for the one "Answer ready" announcement
- `Tab / Enter / Space`: Buttons are ordinary Nexub buttons; GenUI adds no keyboard handling of its own.
- Rendering and streaming never move focus.
- Keyed nodes keep their identity while later siblings stream in, so nothing remounts or loses focus.
- While streaming the region is `aria-busy`; when it ends, one polite "Answer ready" replaces per-token chatter.
- Labels the components need are required by the schema (Button `label`, Table column headers); a node without one is removed, never rendered unlabelled.
- Card titles are headings, shifted by `headingLevel` and clamped to 1–6 so they fit the page’s outline.
- Every string is a text node: HTML, Markdown and URLs in a document show as typed, never as markup or links.
- Strings (region name, "Answer ready", the fallback) translate through NexubProvider messages: `genuiRegion`, `genuiReady`, `genuiFallback`.

Related: [streaming-text](streaming-text.md), [message-bubble](message-bubble.md), [card](card.md), [table](table.md)
