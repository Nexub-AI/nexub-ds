# RFC: @nexub/genui — a versioned UI schema that agents return and Nexub renders safely

<!-- The text of the RFC issue (GOVERNANCE.md → RFC process). Open a GitHub issue with this title and the body below. -->

Open for comments for at least **3 working days** from the day this issue is opened. A maintainer then records the decision here (accepted, accepted with changes, or declined) and closes the issue. Planned in `ROADMAP_12.x.md` (12.4, decision 4: schema and renderer in a new `@nexub/genui` package at `alpha`, served by `@nexub/mcp`; RFC opened in 12.3). The roadmap records the owner's choice of approach; this RFC covers the schema, the renderer API and the safety rules, which GOVERNANCE.md requires for every new package. Products expected to use it: the nexub-platform chat surfaces that adopted Conversation, MessageCard and AgentKit in 12.2.

## Decision

Open. RFC issue #823 was opened on 2026-11-28.

## Problem

Agents in the Nexub products answer with text. When the answer should be a small piece of UI (a summary card with three facts, a table of matching records, a choice between two plans, a short form to fill), each product does one of three things today:

- **Markdown only.** Fine for prose, but no tables with sorting, no buttons, no forms, and nothing looks like the rest of the app.
- **A hand-written mapping per product.** The model returns ad-hoc JSON ("type": "card") and each app maps it to components with its own switch statement, its own idea of which props are allowed, and its own (often missing) checks. Three products, three formats, no shared validation.
- **HTML from the model.** Rejected wherever it was tried: model output is untrusted (prompt injection through tool results is routine), and sanitised HTML still ignores the tokens and the accessibility rules.

The DS already has the parts these answers need (`Card`, `MessageCard`, `DescriptionList`, `Table`, `Badge`, `Alert`, `Button`, fields), the agent surfaces around them (`Conversation`, `PromptInput`, `StreamingText`, `ToolCall`, `ApprovalCard`, `PlanTracker`), and an MCP server that teaches agents the components. What is missing is a format an LLM can return and the DS can render **without trusting it**.

## Proposal

A new package, **`@nexub/genui`** (`packages/genui`), at `alpha`, with two entry points:

- **`@nexub/genui/schema`**: no React, no DOM. The versioned JSON schema (`schema.json`, JSON Schema 2020-12), the TypeScript types, the component catalog (the allow-list), `validate()` and a streaming-tolerant `parsePartial()`. Used by servers, by `@nexub/mcp` and by the renderer.
- **`@nexub/genui`**: the React renderer, `<GenUI>`. It renders a validated document with `@nexub/react` components (a peer dependency, as `@nexub/diagram` does), so it inherits tokens, themes, `data-product`, RTL, dark mode and each component's accessibility.

The rules, all enforced in code and covered by tests:

1. **Allow-list, not a mapping.** Only components in the catalog render, and only the props the catalog lists for each, with a declared type per prop. Anything else is dropped or rejected (see *Unknown and invalid input*).
2. **No raw HTML, ever.** Every string is rendered as a React text child or a typed prop. No `dangerouslySetInnerHTML`, no `className`, no `style`, no `as`, no `ref`, no DOM `id`, no event-handler props. Markdown is not interpreted in v1.
3. **Validation before render.** `<GenUI>` never renders an unvalidated node. Validation is a pure function, so a server can run the same check before it stores or forwards a document.
4. **Actions are names, not code.** A button or form refers to an action by name; the host lists the names it accepts and gets a callback. No URL schemes that run script, no function strings, no `eval`.
5. **Hard limits.** Depth, node count, string length and total size are capped, so a hostile or looping model can't hang the page.

`@nexub/mcp` gains tools that serve the schema, its docs and a validator to agents, so an agent can check its own output before returning it.

## Schema (v1)

A document is one JSON object:

```json
{
  "$schema": "https://unpkg.com/@nexub/genui@0/schema/v1.json",
  "version": "1.0",
  "title": "Plans that fit your team",
  "root": {
    "type": "Stack",
    "props": { "gap": "md" },
    "children": [
      { "type": "Heading", "props": { "level": 2, "text": "Two plans fit a team of 12" } },
      {
        "type": "Grid",
        "props": { "columns": 2 },
        "children": [
          {
            "type": "Card",
            "key": "team",
            "children": [
              { "type": "Heading", "props": { "level": 3, "text": "Team" } },
              { "type": "Text", "props": { "text": "€8 per seat, monthly" } },
              { "type": "Badge", "props": { "tone": "good", "text": "Recommended" } },
              { "type": "Button", "props": { "label": "Choose Team", "variant": "filled", "action": { "name": "choosePlan", "payload": { "plan": "team" } } } }
            ]
          },
          {
            "type": "Card",
            "key": "business",
            "children": [
              { "type": "Heading", "props": { "level": 3, "text": "Business" } },
              { "type": "Text", "props": { "text": "€14 per seat, monthly, with SSO" } },
              { "type": "Button", "props": { "label": "Choose Business", "variant": "tonal", "action": { "name": "choosePlan", "payload": { "plan": "business" } } } }
            ]
          }
        ]
      },
      { "type": "Link", "props": { "text": "Compare every plan", "href": "https://example.com/pricing" } }
    ]
  }
}
```

| Field | Type | Rules |
| --- | --- | --- |
| `version` | `"<major>.<minor>"` string | Required. See *Versioning*. |
| `$schema` | string | Optional; ignored by the renderer, useful in editors. |
| `title` | string | Optional; becomes the accessible name of the rendered region. |
| `root` | node | Required. One node. |
| node `type` | string | Required. A catalog name, PascalCase: the name of the `@nexub/react` export it renders (`Image` is the one renderer-owned part, an `<img>` in `AspectRatio`). |
| node `props` | object | Optional. Only the catalog's props for that type; values are JSON (string, number, boolean, null, arrays and objects of those). |
| node `children` | array of nodes or strings | Optional, and only on types the catalog marks as containers. A string child is text. |
| node `key` | string | Optional, `[A-Za-z0-9_-]{1,64}`. Stable identity for streaming updates and React keys. Never rendered into the DOM. |

**Prop types.** Each catalog prop has one of these types, and the validator checks the value against it:

| Prop type | Accepts | Rendered as |
| --- | --- | --- |
| `text` | string, max 2,000 characters (10,000 for `Text.text`) | a text child or a string prop |
| `number` | finite number in the declared range | number |
| `boolean` | boolean | boolean |
| `enum` | one of the listed strings (`tone`, `size`, `variant`, `gap` …) | that string |
| `href` | string that passes `safeHref` (strict: relative, `#`, http(s), mailto, tel, sms) | a link target with `rel="noopener noreferrer"`; external links show their host |
| `src` | string that passes `safeSrc` (relative, http(s), blob, `data:image/*`) | an image source |
| `action` | `{ "name": string, "payload"?: JSON }` | a callback to the host (see *Actions*) |
| `rows` / `columns` | arrays of the above, for `Table`, `DescriptionList`, `Chart` data | data, never markup |

**Catalog v1.** Small on purpose; it grows by minor versions:

- Layout: `Stack`, `Grid`, `Card`, `Separator`.
- Content: `Heading`, `Text`, `Badge`, `Alert`, `DescriptionList`, `Table` (data only: `columns`, `rows`, optional `sortable`), `Progress`, `Link`, `Image` (`src`, required `alt`).
- Agent parts: `MessageCard` (title, status, fields, actions), `ToolCall` (name, status), `PlanTracker` (steps).
- Actions and input: `Button`, `Form` with `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup` (each with a required `label` and a `name`).

Not in v1 (open questions below): `Chart`, icons, Markdown text, password, payment or file inputs.

## Unknown and invalid input

`validate(doc, options?)` returns `{ ok, document, issues }`. `document` is the cleaned document (what will render); `issues` is a list of `{ path, code, message }` with a JSON Pointer path (`/root/children/1/props/tone`), written so an agent can fix its output.

| Input | Default (`onInvalid: 'drop'`) | `onInvalid: 'reject'` |
| --- | --- | --- |
| Unknown `type` | node and its children removed; issue `unknown-component` | whole document rejected |
| Unknown prop (including `className`, `style`, `on*`, `dangerouslySetInnerHTML`) | prop removed; issue `unknown-prop` | rejected |
| Prop with the wrong type, out of range, or a blocked URL | prop removed, component default applies; issue `invalid-prop` | rejected |
| Required prop missing (`Button.label`, `Image.alt`, field `label`) | node removed; issue `missing-prop` | rejected |
| `children` on a non-container | children removed; issue `unexpected-children` | rejected |
| Unsupported major `version`, not JSON, limits exceeded | always rejected; issue `unsupported-version` / `parse-error` / `too-large` | rejected |

Limits (defaults, lowerable by the host): depth 16, 500 nodes, 256 kB of JSON. Objects are parsed with null prototypes and the keys `__proto__`, `constructor` and `prototype` are refused anywhere in the document.

When the document is rejected, `<GenUI>` renders `fallback` (default: an `ErrorState` with "This answer couldn't be shown", through the messages mechanism) and calls `onIssues`. In development the renderer also logs the issues.

## Actions

Generated UI never runs code and never navigates on its own. An `action` prop is a name and an optional JSON payload:

```json
{ "type": "Button", "props": { "label": "Approve refund", "tone": "danger", "action": { "name": "approveRefund", "payload": { "orderId": "A-1042" } } } }
```

- The host passes `actions`, the list of names it accepts. A button whose action name isn't listed is dropped with an `unknown-action` issue, so the model can't invent capabilities.
- On press, the renderer calls `onAction({ name, payload, key, values })`. `values` is filled only for a `Form`'s submit button: the form's field values by `name`, as strings and booleans. The payload is passed as parsed JSON, size-capped; the host must treat it as untrusted input and validate it as it would a request body.
- Side effects stay with the host. The recommended pattern for anything that changes data is the 12.4 approval gate: the host answers `onAction` by showing `ApprovalCard` with its own text, not the model's.
- Links are the only navigation, through `href` (checked by `safeHref`), as normal anchors the user clicks. No `window.open`, no automatic redirects.
- Each action fires once per press; buttons show their pending state while `onAction` returns a pending promise.

## Streaming and partial documents

Models stream tokens, so `<GenUI>` accepts a growing string as well as a parsed object:

```tsx
<GenUI document={partialText} streaming={isStreaming} actions={['choosePlan']} onAction={handle} />
```

- `parsePartial(text)` is a tolerant parser for incomplete JSON: it closes open strings, arrays and objects and returns the document so far. It never evaluates anything.
- A node renders once its `type` and its `props` object are complete and valid; a node still arriving shows a `Skeleton` in its place. Text props may render while still growing (as `StreamingText` does), but `href`, `src` and `action` render only when complete, so a half-streamed URL is never clickable.
- `key` keeps nodes stable between updates, so nothing remounts or loses focus while later siblings arrive.
- While `streaming` is true the region has `aria-busy="true"`; actions are disabled until the document is complete and has passed full validation. When streaming ends the document is validated once more and the final `onIssues` fires.
- Agents that prefer incremental updates over one growing document can send several complete documents with the same keys; the renderer reconciles by `key`. (A JSON-Patch stream is an open question.)

## API

```tsx
import { GenUI } from '@nexub/genui';
import { validate, catalog } from '@nexub/genui/schema';

<GenUI
  document={doc}                      // GenUIDocument | string (partial JSON while streaming)
  streaming={false}                   // aria-busy, skeletons, actions disabled until complete
  actions={['choosePlan']}            // accepted action names; default [] (no actions render)
  onAction={(a) => {}}                // ({ name, payload, key, values }) => void | Promise<void>
  catalog={catalog.only(['Card', 'Heading', 'Text', 'Button'])} // default: the whole v1 catalog
  onInvalid="drop"                    // 'drop' (default) | 'reject'
  onIssues={(issues) => {}}           // validation issues, for logging or sending back to the agent
  limits={{ maxNodes: 200 }}          // lower the defaults; can't raise above them
  headingLevel={3}                    // document levels are shifted so `level: 1` renders as this
  fallback={<MyError />}              // shown when the document is rejected
  aria-label="Assistant answer"       // default: document `title`, else messages.genuiRegion
/>
```

From `@nexub/genui/schema`:

- `validate(doc: unknown, options?): { ok: boolean; document?: GenUIDocument; issues: GenUIIssue[] }`
- `parsePartial(text: string): { document?: unknown; complete: boolean }`
- `catalog`: the v1 allow-list with each component's props, types, defaults and a one-line description; `catalog.only(names)` and `catalog.without(names)` narrow it.
- `schema`: the JSON Schema object (also published as `@nexub/genui/schema/v1.json`), and `toolSchema(catalog?)`: the same schema narrowed to a catalog, shaped for an LLM's structured-output or tool-input parameter.
- Types: `GenUIDocument`, `GenUINode`, `GenUIAction`, `GenUIIssue`, `GenUIVersion`.

Inside a conversation it sits where a message's content goes:

```tsx
<Conversation>
  <MessageBubble from="assistant">
    <GenUI document={message.ui} streaming={message.streaming} actions={['choosePlan']} onAction={choosePlan} />
  </MessageBubble>
</Conversation>
```

Custom components from the host are **not** in v1: the catalog is the DS's. Whether hosts can register their own entries (with the same typed props) is an open question.

## `@nexub/mcp`

Three additions to the existing server, following its rules (every argument has a maximum, lookups go through the catalog, never a path):

- `get_genui_schema`: the schema version, the JSON Schema (optionally narrowed to listed components) and the rules above in short form.
- `get_genui_component`: one catalog entry with its props, types, defaults and an example node.
- `validate_genui`: validates a document (max 256 kB) and returns the issues with their paths, so an agent can fix its output before returning it.

Plus a `build_genui` prompt beside `build_screen`. `@nexub/mcp` depends on `@nexub/genui` for the React-free `schema` entry only; the dependency is listed in `dependency-policy.json` with that reason.

## Versioning and compatibility

- `version` is `"<major>.<minor>"` and is independent of the npm version. v1 ships as `"1.0"`.
- A **minor** adds components, props or enum values. A renderer that supports `1.n` renders any `1.m`: for `m ≤ n` everything is known; for `m > n` the new parts are unknown and follow `onInvalid` (dropped by default), so older apps degrade instead of breaking.
- A **major** removes or changes the meaning of something. A renderer rejects a major it doesn't support with `unsupported-version`. One renderer may support more than one major during a migration.
- The catalog is the single source: `schema.json`, the TypeScript types, the MCP docs and the validator are generated from it, and a test fails when a catalog prop no longer matches the `@nexub/react` component's prop type.
- The package is `alpha`, so the renderer API may change in a minor (GOVERNANCE.md). The **schema** is held to a stricter rule from the start: no breaking change inside major 1, because documents outlive releases (they are stored in chat histories).

## Accessibility

- The output is one region (`role="region"`, named by `aria-label`, the document `title` or a default string) so screen-reader users know where generated content starts and ends.
- Every rendered part is a `@nexub/react` component with its own roles and keyboard map; the renderer adds no interaction of its own.
- Labels are required by the schema where the component needs one: `Button.label`, field `label`, `Image.alt` (an empty string marks decoration), `Table` column headers. A node without one is dropped, not rendered unlabelled.
- Heading levels are shifted by `headingLevel` and clamped to 1–6, so generated headings fit the host page's outline.
- Focus is never moved by rendering or streaming. While streaming, the region is `aria-busy`; when it completes, one polite announcement ("Answer ready", through the messages mechanism) replaces per-token chatter. Conversation's own live region rules stay in charge inside a chat.
- Skeletons and entering nodes respect reduced motion. Contrast, forced colours and touch targets come from the components.
- Tested with axe on rendered fixtures (light, dark, RTL) and with cases in `a11y.visual.spec.ts` for the region name, `aria-busy` and the completion announcement.

## Web + native parity

The schema is platform-neutral: it names DS components and typed props, nothing about the DOM. 12.4 ships the web renderer only. A `@nexub/react-native` renderer (`@nexub/genui/native`) can render the same documents later from the same catalog, with a `platforms` field per catalog entry for parts that exist on one side only; it is listed as a parity gap in 12.4. Until then, native apps show the message's text fallback.

## Security

- **XSS corpus tests extended to the renderer.** The 9.6 corpus (`packages/react/src/utils/xss-corpus.ts`, imported by the genui tests as `@nexub/patterns` and `@nexub/marketing` do) runs through every catalog entry: every `text` prop and string child gets each `XSS_TEXT` value, every `href` / `src` prop each `XSS_URLS` value, and `auditDom` must find nothing in the rendered output. Structural cases on top: unknown types named `script`, `iframe` or `a`; `dangerouslySetInnerHTML`, `style`, `className`, `on*` and `ref` props; `__proto__` and `constructor` keys; non-JSON values; documents past each limit; half-streamed URLs and actions.
- **Misleading UI** is the risk validation can't remove: a valid document can still say something false ("Your session expired, sign in again"). Mitigations: no password, payment, file or one-time-code inputs in the catalog; external links show their host; the region is visibly an assistant answer (it renders inside the host's message chrome); actions reach the host only by name, and the host writes the confirmation text.
- **Denial of service**: the limits above, enforced in `parsePartial` as well as `validate`.
- No network access from the renderer: images load only from `src` values that pass `safeSrc`, and the host can drop `Image` from its catalog.

## Alternatives

- **Do nothing / Markdown only**: keeps today's three formats and no interactivity. The roadmap item exists to end that.
- **HTML from the model, sanitised (DOMPurify or similar)**: excluded by decision 4 ("no raw HTML"); sanitising HTML is a moving target, and the result ignores tokens and accessibility.
- **The model writes JSX or code that the app runs**: arbitrary code execution from untrusted output. Not considered further.
- **Server-rendered React components streamed to the client (React Server Components, as some AI SDKs do)**: ties every product to one server framework, gives agents nothing to validate against, and doesn't work for agents outside the app (MCP clients).
- **Adopt an existing open agent-UI format** (for example Google's A2UI): worth tracking, and the shape above is close to them (a typed component tree with named actions). We would still need our own catalog of Nexub components and props, and these formats are young and moving. An adapter can come later if one becomes common; see open questions.
- **Compose existing components per product (MessageCard with structured fields)**: covers one card shape, not tables, forms or layout, and leaves validation to each app.
- **Put the renderer in `@nexub/react`**: adds the validator and catalog to every app's bundle; a separate package keeps them out of apps that don't render generated UI, and lets `@nexub/mcp` use the schema without React.

## Migration

None: a new package at `alpha`. The implementation PR in 12.4 adds:

- `packages/genui` with `.` and `./schema` entries, `@nexub/react`, `react` and `react-dom` as peers, and no other runtime dependencies (the validator and partial parser are hand-written, so no schema library ships to the browser).
- A `dependency-policy.json` entry for `@nexub/genui`, and the `@nexub/genui` dependency of `@nexub/mcp` with its reason.
- A trusted-publisher placeholder on npm for `@nexub/genui` (`Nexub-AI/nexub-ds` → `release.yml`), set up before the first publish as for `@nexub/diagram` and `@nexub/elements` in 11.6.
- Its own size budgets in `size-budgets.json`: `genui` (the renderer, `@nexub/react` external) and `genui/schema`. Targets: about 8 kB and 6 kB gzip; the PR sets the measured values.
- English strings (region name, "Answer ready", the fallback message) through the messages mechanism.
- A docs page under AI with a playground that validates and renders a pasted document, and the MCP tools in the MCP docs.

## Open questions

1. **Markdown in `Text`.** Allow a safe subset (emphasis, inline code, lists, links through `safeHref`) via a `format: "markdown"` prop in 1.1, or keep text plain and let the model use nodes?
2. **Charts and icons.** `Chart` needs a data shape the model gets right; icons need a fixed name list without pulling every icon into the bundle. 1.1 or later?
3. **Host components.** Should hosts register their own catalog entries (typed props only, same rules), or is the catalog DS-only for the whole of major 1?
4. **Streaming format.** One growing JSON document (proposed) only, or also a JSON-Patch / JSON Lines stream of `{ op, key, node }` updates?
5. **Provider limits.** Some structured-output modes limit recursive schemas or schema size. Is a flattened `toolSchema` (nodes in a list with parent keys) worth offering beside the nested one?
6. **Alignment with an open format.** Ship an adapter for A2UI (or another format) in 12.x, or wait until one settles?
7. **Native renderer timing.** 12.5 (with the native screens) or after?
