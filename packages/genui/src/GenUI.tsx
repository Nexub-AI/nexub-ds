'use client';

// <GenUI>: renders a validated generative UI document with @nexub/react components (RFC #823).
// Every node goes through validate() first. Props reach a component only through the explicit
// mapping below, so nothing in a document (className, style, on*, ref, id, as, raw HTML) can
// reach the DOM; every string is a React text child or a typed prop.
import * as React from 'react';
import { Alert } from '@nexub/react/Alert';
import { Badge } from '@nexub/react/Badge';
import { Button } from '@nexub/react/Button';
import { Card } from '@nexub/react/Card';
import { DescriptionList } from '@nexub/react/DescriptionList';
import { ErrorState } from '@nexub/react/ErrorState';
import { Heading } from '@nexub/react/Heading';
import { useNexubMessages } from '@nexub/react/NexubProvider';
import { Skeleton } from '@nexub/react/Skeleton';
import { StreamingText } from '@nexub/react/StreamingText';
import { Table } from '@nexub/react/Table';
import { Text } from '@nexub/react/Text';
import { VisuallyHidden } from '@nexub/react/VisuallyHidden';
import {
  parsePartial,
  validate,
  type GenUICatalog,
  type GenUICell,
  type GenUIChild,
  type GenUIDocument,
  type GenUIIssue,
  type GenUIJson,
  type GenUILimits,
  type GenUINode,
  type GenUIOnInvalid,
  type GenUIPropsByType,
  type ValidateResult,
} from './schema/index.js';
import { genuiMessages } from './messages.js';

/** What a Button sends to the host. Treat `payload` as untrusted input, like a request body. */
export interface GenUIActionEvent {
  name: string;
  payload?: GenUIJson;
  /** The Button's node key, when the document gave one. */
  key?: string;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface GenUIProps {
  /** A document object, or its JSON text (partial while `streaming`). Validated before anything renders. */
  document: unknown;
  /** More text is coming: the region is aria-busy, nodes still arriving show skeletons, buttons wait. */
  streaming?: boolean;
  /** Action names the host accepts. A Button with any other action is removed. @default [] (no buttons) */
  actions?: readonly string[];
  /** Called once per press with the action's name and payload. Return a promise to show the button busy. */
  onAction?: (action: GenUIActionEvent) => void | Promise<unknown>;
  /** Narrow the allow-list: `catalog.only(['Card', 'Badge'])`. @default the whole v1 catalog */
  catalog?: GenUICatalog;
  /** `drop` removes invalid parts and renders the rest; `reject` shows `fallback` on any issue. @default 'drop' */
  onInvalid?: GenUIOnInvalid;
  /** Validation issues of a finished document, to log or send back to the agent. */
  onIssues?: (issues: GenUIIssue[]) => void;
  /** Lower the limits (depth 16, 500 nodes, 256 kB); higher values are ignored. */
  limits?: Partial<GenUILimits>;
  /** Heading level of a top-level Card title; nested cards go one level down, up to 6. @default 3 */
  headingLevel?: HeadingLevel;
  /** Shown when the document is rejected. @default an ErrorState with "This answer couldn't be shown" */
  fallback?: React.ReactNode;
  /** The region's name. @default the document's `title`, else "Generated answer" */
  'aria-label'?: string;
}

const PENDING: ValidateResult = { ok: true, document: { version: '1.0', root: { type: null, pending: true } }, issues: [] };

function check(
  document: unknown,
  streaming: boolean,
  options: { actions: readonly string[]; catalog?: GenUICatalog; onInvalid?: GenUIOnInvalid; limits?: Partial<GenUILimits> },
): ValidateResult {
  if (typeof document === 'string' && streaming) {
    const parsed = parsePartial(document, { limits: options.limits });
    if (!parsed.error && !parsed.complete) {
      if (parsed.document === undefined) return PENDING;
      return validate(parsed.document, { ...options, partial: parsed });
    }
  }
  return validate(document, options);
}

const devWarn = (issues: GenUIIssue[]) => {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV;
  if (env !== 'production' && issues.length) console.warn('[@nexub/genui] document issues:', issues);
};

interface RenderContext {
  streaming: boolean;
  onAction?: GenUIProps['onAction'];
}

const RenderContext = React.createContext<RenderContext>({ streaming: false });

/** React keys from node keys, made unique among siblings; index otherwise. */
function keysFor(children: readonly GenUIChild[]): string[] {
  const seen = new Set<string>();
  return children.map((c, i) => {
    let k = typeof c === 'object' && c.key ? `k:${c.key}` : `i:${i}`;
    if (seen.has(k)) k = `${k}~${i}`;
    seen.add(k);
    return k;
  });
}

const cellText = (v: GenUICell | undefined) => (v === null || v === undefined ? '' : String(v));

function ActionButton({ props, nodeKey }: { props: GenUIPropsByType['Button']; nodeKey?: string }) {
  const { streaming, onAction } = React.useContext(RenderContext);
  const [busy, setBusy] = React.useState(false);
  const busyRef = React.useRef(false);
  const press = () => {
    if (busyRef.current || streaming || !onAction) return; // once per press, never while streaming
    const event: GenUIActionEvent = { name: props.action.name, ...(props.action.payload !== undefined && { payload: props.action.payload }), ...(nodeKey && { key: nodeKey }) };
    const result = onAction(event);
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      busyRef.current = true;
      setBusy(true);
      const done = () => {
        busyRef.current = false;
        setBusy(false);
      };
      (result as Promise<unknown>).then(done, done);
    }
  };
  return (
    <Button
      type="button"
      variant={props.variant}
      tone={props.tone}
      size={props.size}
      loading={busy}
      disabled={streaming || !onAction}
      onClick={press}
    >
      {props.label}
    </Button>
  );
}

function GenNode({ node, level }: { node: GenUIChild; level: HeadingLevel }): React.ReactNode {
  const { streaming } = React.useContext(RenderContext);
  if (typeof node === 'string') return <Text size="body-sm">{node}</Text>;
  if (node.type === null) return <Skeleton shape="rect" height={40} data-genui-pending="" />;
  return renderNode(node, level, streaming);
}

function Children({ nodes, level }: { nodes: readonly GenUIChild[]; level: HeadingLevel }) {
  const keys = keysFor(nodes);
  return nodes.map((n, i) => <GenNode key={keys[i]} node={n} level={level} />);
}

function renderNode(node: GenUINode, level: HeadingLevel, streaming: boolean): React.ReactNode {
  switch (node.type) {
    case 'Card': {
      const p = node.props;
      return (
        <Card variant={p.variant} tone={p.tone}>
          <div className="flex flex-col gap-3 p-4">
            {(p.title !== undefined || p.description !== undefined) && (
              <div className="flex flex-col gap-1">
                {p.title !== undefined && (
                  <Heading level={level} size="h5">
                    {p.title}
                  </Heading>
                )}
                {p.description !== undefined && (
                  <Text size="body-sm" tone="muted">
                    {p.description}
                  </Text>
                )}
              </div>
            )}
            {node.children && <Children nodes={node.children} level={Math.min(6, level + 1) as HeadingLevel} />}
          </div>
        </Card>
      );
    }
    case 'DescriptionList': {
      const p = node.props;
      return (
        <DescriptionList.Root layout={p.layout} columns={p.columns} divided={p.divided} size={p.size}>
          {p.items.map((item, i) => (
            <DescriptionList.Item key={i} label={item.label} emphasis={item.emphasis}>
              {item.value}
            </DescriptionList.Item>
          ))}
        </DescriptionList.Root>
      );
    }
    case 'Table': {
      const p = node.props;
      return (
        <Table.Root density={p.density} striped={p.striped}>
          {p.caption !== undefined && <Table.Caption>{p.caption}</Table.Caption>}
          <Table.Header>
            <Table.Row>
              {p.columns.map((c, i) => (
                <Table.Head key={i} scope="col" className={c.align === 'end' ? 'text-end' : undefined}>
                  {c.label}
                </Table.Head>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {p.rows.map((row, r) => (
              <Table.Row key={r}>
                {p.columns.map((c, i) => (
                  <Table.Cell key={i} className={c.align === 'end' ? 'text-end tabular-nums' : undefined}>
                    {cellText(row[i])}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      );
    }
    case 'Badge': {
      const p = node.props;
      return (
        <span>
          <Badge tone={p.tone} variant={p.variant} size={p.size}>
            {p.text}
          </Badge>
        </span>
      );
    }
    case 'Alert': {
      const p = node.props;
      return (
        <Alert tone={p.tone} title={p.title}>
          {p.text}
        </Alert>
      );
    }
    case 'StreamingText':
      return <StreamingText text={node.props.text} streaming={streaming} />;
    case 'Button':
      return (
        <div>
          <ActionButton props={node.props} nodeKey={node.key} />
        </div>
      );
  }
}

/**
 * Renders a generative UI document an agent returned, safely: only catalog components and props,
 * validated before render, actions by name only. @alpha
 */
export function GenUI({
  document,
  streaming = false,
  actions = NO_ACTIONS,
  onAction,
  catalog,
  onInvalid,
  onIssues,
  limits,
  headingLevel = 3,
  fallback,
  'aria-label': ariaLabel,
}: GenUIProps) {
  const messages = { ...genuiMessages, ...pick(useNexubMessages()) };
  const actionsKey = actions.join('\n');
  const limitsKey = limits ? `${limits.maxDepth}/${limits.maxNodes}/${limits.maxBytes}` : '';
  const result = React.useMemo(
    () => check(document, streaming, { actions, catalog, onInvalid, limits }),
    // actions and limits by value: hosts often pass new arrays and objects each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [document, streaming, actionsKey, catalog, onInvalid, limitsKey],
  );

  // Issues of a finished document, once per result. Streaming results are not final.
  const onIssuesRef = React.useRef(onIssues);
  React.useEffect(() => {
    onIssuesRef.current = onIssues;
  });
  React.useEffect(() => {
    if (streaming || !result.issues.length) return;
    devWarn(result.issues);
    onIssuesRef.current?.(result.issues);
  }, [result, streaming]);

  // One polite "Answer ready" when streaming ends, instead of per-token chatter.
  const [announcement, setAnnouncement] = React.useState('');
  const wasStreaming = React.useRef(streaming);
  React.useEffect(() => {
    if (wasStreaming.current && !streaming && result.ok) setAnnouncement(messages.genuiReady);
    if (streaming) setAnnouncement('');
    wasStreaming.current = streaming;
  }, [streaming, result.ok, messages.genuiReady]);

  const doc: GenUIDocument | undefined = result.ok ? result.document : undefined;
  const level = Math.min(6, Math.max(1, Math.round(headingLevel))) as HeadingLevel;
  const ctx = React.useMemo(() => ({ streaming, onAction }), [streaming, onAction]);

  return (
    <div
      role="region"
      aria-label={ariaLabel ?? doc?.title ?? messages.genuiRegion}
      aria-busy={streaming || undefined}
      data-genui=""
      className="flex flex-col gap-3"
    >
      {doc ? (
        <RenderContext.Provider value={ctx}>
          <GenNode node={doc.root} level={level} />
        </RenderContext.Provider>
      ) : (
        (fallback ?? <ErrorState title={messages.genuiFallback} tone="warning" />)
      )}
      <VisuallyHidden>
        <span role="status" aria-live="polite" data-genui-announce="">
          {announcement}
        </span>
      </VisuallyHidden>
    </div>
  );
}

const NO_ACTIONS: readonly string[] = [];

/** The provider's genui… messages that are set (they are optional in NexubMessages). */
function pick(m: Partial<Record<keyof typeof genuiMessages, string | undefined>>) {
  const out: Partial<typeof genuiMessages> = {};
  for (const k of Object.keys(genuiMessages) as (keyof typeof genuiMessages)[]) if (typeof m[k] === 'string') out[k] = m[k];
  return out;
}
