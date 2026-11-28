// 12.5: native twins of the AgentKit parts (web 4.8 + 12.4): ToolCall, ApprovalCard, DiffView and
// DiffReview. Strings come from the provider's messages (ToolCall and DiffView also take a
// `messages` prop, as on web). Code and diffs always read left to right, also in RTL.
import * as React from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  ScrollView,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ChevronDown } from '@nexub/icons/native';
import type { NexubMessages } from '@nexub/core';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Surface } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { fontStyle } from '../theme/fonts';
import { useTheme, type RoleName } from '../theme/ThemeProvider';
import { Button } from './actions';
import { Badge } from './display';

const json = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2));
const isThenable = (r: unknown): r is Promise<unknown> => !!r && typeof (r as Promise<unknown>).then === 'function';

/** Announces each change of `text` after the first render (iOS has no live regions). */
function useAnnounce(text: string) {
  const last = React.useRef(text);
  React.useEffect(() => {
    if (last.current === text) return;
    last.current = text;
    if (text) AccessibilityInfo.announceForAccessibility(text);
  }, [text]);
}

/** A block of code: mono, left to right, scrolls sideways. */
function Code({ children, tone }: { children: string; tone?: [RoleName, RoleName] }) {
  const { roles, tokens } = useTheme();
  const [bg, fg] = tone ?? ['surface', 'on-surface'];
  return (
    <ScrollView
      horizontal
      style={{ direction: 'ltr', borderRadius: tokens.shape.field, backgroundColor: roles[bg] }}
      contentContainerStyle={{ padding: tokens.spacing[2] }}
    >
      <Text variant="body-sm" family="mono" color={fg} style={{ writingDirection: 'ltr', textAlign: 'left' }}>
        {children}
      </Text>
    </ScrollView>
  );
}

function Caption({ children }: { children: string }) {
  const { tokens } = useTheme();
  return (
    <Text variant="label-sm" color="on-surface-variant" style={{ marginBottom: tokens.spacing[1] }}>
      {children}
    </Text>
  );
}

// ─── ToolCall ────────────────────────────────────────────────────────────────

export interface ToolCallProps {
  /** Tool name, e.g. "search_invoices". */
  name: string;
  status: 'running' | 'done' | 'failed';
  /** Arguments, shown as JSON. */
  input?: unknown;
  /** Result, shown as given (string) or as JSON. */
  output?: unknown;
  /** How long the call took, in milliseconds; shown formatted ("1.2 s") beside the status. */
  duration?: number;
  /** Why the call failed, shown in the failed state. A failed call with an `error` starts open. */
  error?: React.ReactNode;
  /** Shows a Retry button in the failed state. */
  onRetry?: () => void;
  /** Open on first render. */
  defaultOpen?: boolean;
  /** Controlled open state; pair it with `onOpenChange`. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Strings for this card, over the provider's messages. */
  messages?: Partial<NexubMessages>;
  style?: StyleProp<ViewStyle>;
}

/** One tool call: name and status, expandable to its input and output. Status changes are announced. */
export function ToolCall({
  name,
  status,
  input,
  output,
  duration,
  error,
  onRetry,
  defaultOpen,
  open: openProp,
  onOpenChange,
  messages,
  style,
}: ToolCallProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const m = messages ? { ...theme.messages, ...messages } : theme.messages;
  const failed = status === 'failed';
  const showError = failed && error != null && error !== false;
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen ?? showError,
    onChange: onOpenChange,
  });
  const statusText = m.toolCallStatus[status];
  // Running → Done is announced without moving focus, like web's polite badge.
  useAnnounce(statusText);
  const time = duration !== undefined ? m.toolCallDuration(duration) : undefined;
  return (
    <Surface
      tone="surface-container-low"
      radius="container"
      style={[{ borderWidth: 1, borderColor: roles['outline-variant'], overflow: 'hidden' }, style]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={[name, statusText, time].filter(Boolean).join(', ')}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        pressScale={false}
        style={{
          minHeight: tokens.size.control.lg,
          paddingHorizontal: tokens.spacing[3],
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.spacing[2],
        }}
      >
        <View style={{ transform: [{ rotate: open ? '0deg' : theme.dir === 'rtl' ? '90deg' : '-90deg' }] }}>
          <ChevronDown size="sm" color={roles['on-surface-variant']} />
        </View>
        <Text variant="label-md" family="mono" numberOfLines={1} style={{ flex: 1 }}>
          {name}
        </Text>
        {time && (
          <Text variant="label-sm" color="on-surface-variant" tabular>
            {time}
          </Text>
        )}
        <Badge tone={failed ? 'danger' : status === 'done' ? 'success' : 'neutral'} size="sm" style={{ alignSelf: 'center' }}>
          {statusText}
        </Badge>
      </Pressable>
      {open && (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: roles['outline-variant'],
            padding: tokens.spacing[3],
            gap: tokens.spacing[2],
          }}
        >
          {input !== undefined && (
            <View>
              <Caption>{m.toolCallInput}</Caption>
              <Code>{json(input)}</Code>
            </View>
          )}
          {output !== undefined && (
            <View>
              <Caption>{m.toolCallOutput}</Caption>
              <Code>{json(output)}</Code>
            </View>
          )}
          {showError && (
            <View>
              <Caption>{m.toolCallError}</Caption>
              <View style={{ borderRadius: tokens.shape.field, backgroundColor: roles['error-container'], padding: tokens.spacing[2] }}>
                {typeof error === 'string' || typeof error === 'number' ? (
                  <Text variant="body-sm" color="on-error-container">
                    {error}
                  </Text>
                ) : (
                  error
                )}
              </View>
            </View>
          )}
          {failed && onRetry && (
            <Button size="sm" variant="outlined" onPress={onRetry}>
              {m.retry}
            </Button>
          )}
        </View>
      )}
    </Surface>
  );
}

// ─── ApprovalCard ────────────────────────────────────────────────────────────

/** How an approval ended. `edited` = approved with changed arguments. */
export type ApprovalOutcome = 'approved' | 'edited' | 'denied';

type Result = void | Promise<unknown>;

export interface ApprovalCardProps {
  /** What the agent wants to do, e.g. "Send 3 invoices to Acme". */
  title: string;
  /** Details: who, how much, what changes. A string is set as text. */
  children?: React.ReactNode;
  /** Called once with the choice. Return a promise to show the pending state until it settles (a rejection returns to the choice). */
  onApprove?: () => Result;
  onDeny?: () => Result;
  approveLabel?: string;
  denyLabel?: string;
  /** The action's arguments, shown as JSON (or as given, for a string). With `onEdit` they can be edited before approving. */
  args?: unknown;
  /** Adds Edit. Called with the edited arguments text when the user approves with changes. */
  onEdit?: (args: string) => Result;
  /** Label for the Edit button. @default 'Edit' */
  editLabel?: string;
  /** Controlled outcome. `null` keeps the choice open; omit it to let the card track the choice. */
  outcome?: ApprovalOutcome | null;
  /** The action is being carried out: the buttons are blocked and "Working…" is announced. */
  pending?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * The agent asks before it acts: Approve, Edit (with `args` and `onEdit`) or Deny. After a choice
 * the buttons give way to the outcome, which is announced and gets the screen reader's focus.
 */
export function ApprovalCard({
  title,
  children,
  onApprove,
  onDeny,
  approveLabel,
  denyLabel,
  args,
  onEdit,
  editLabel,
  outcome,
  pending,
  style,
}: ApprovalCardProps) {
  const { roles, tokens, fonts, messages: m } = useTheme();
  const [choice, setChoice] = React.useState<ApprovalOutcome | null>(null);
  const [clicked, setClicked] = React.useState<ApprovalOutcome | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const statusRef = React.useRef<React.ComponentRef<typeof View>>(null);
  const acted = React.useRef(false);
  const resolved = outcome !== undefined ? outcome : choice;
  const isPending = !resolved && (busy || !!pending);
  const statusText = isPending ? m.approvalPending : resolved ? m.approvalOutcome[resolved] : '';
  useAnnounce(statusText);

  // The buttons go away once the choice resolves: the screen reader lands on the outcome.
  React.useEffect(() => {
    if (!resolved || !acted.current) return;
    const tag = statusRef.current && findNodeHandle(statusRef.current);
    if (tag) AccessibilityInfo.setAccessibilityFocus(tag);
  }, [resolved]);

  const act = (kind: ApprovalOutcome, fn?: () => Result) => {
    if (isPending) return;
    acted.current = true;
    setClicked(kind);
    const r = fn?.();
    if (isThenable(r)) {
      setBusy(true);
      r.then(
        () => (setBusy(false), setChoice(kind)),
        () => setBusy(false),
      );
    } else setChoice(kind);
  };

  const canEdit = !!onEdit && args !== undefined;
  const actionProps = (kind: ApprovalOutcome) => ({
    loading: isPending && clicked === kind,
    disabled: isPending && clicked !== kind,
  });

  return (
    <Surface
      tone="surface-elevated"
      radius="container"
      style={[
        { borderWidth: 1, borderColor: roles['outline-variant'], padding: tokens.spacing[4], gap: tokens.spacing[3] },
        style,
      ]}
    >
      <Text variant="title-sm" accessibilityRole="header">
        {title}
      </Text>
      {children != null &&
        (typeof children === 'string' ? (
          <Text variant="body-sm" color="on-surface-variant">
            {children}
          </Text>
        ) : (
          children
        ))}
      {args !== undefined && (
        <View>
          <Caption>{m.approvalArgs}</Caption>
          {editing && !resolved ? (
            <TextInput
              accessibilityLabel={m.approvalArgs}
              value={draft}
              onChangeText={setDraft}
              editable={!isPending}
              multiline
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              selectionColor={roles.primary}
              style={{
                direction: 'ltr',
                writingDirection: 'ltr',
                textAlign: 'left',
                textAlignVertical: 'top',
                minHeight: tokens.size.control.xl * 2,
                borderWidth: 1,
                borderColor: roles.outline,
                borderRadius: tokens.shape.field,
                backgroundColor: roles.surface,
                padding: tokens.spacing[2],
                color: roles['on-surface'],
                ...fontStyle('mono', 400, fonts),
                fontSize: tokens.type['body-sm'].size,
              }}
            />
          ) : (
            <Code>{choice === 'edited' && outcome === undefined ? draft : json(args)}</Code>
          )}
        </View>
      )}
      {/* Announced by useAnnounce (both platforms); no live region, so Android does not read it twice. */}
      <View ref={statusRef} accessible={!!statusText}>
        {!!statusText && (
          <Text variant="label-md" color="on-surface-variant">
            {statusText}
          </Text>
        )}
      </View>
      {!resolved &&
        (editing ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[2] }}>
            <Button size="sm" {...actionProps('edited')} onPress={() => act('edited', () => onEdit?.(draft))}>
              {m.approvalApproveEdited}
            </Button>
            <Button size="sm" variant="outlined" disabled={isPending} onPress={() => setEditing(false)}>
              {m.cancel}
            </Button>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[2] }}>
            <Button size="sm" {...actionProps('approved')} onPress={() => act('approved', onApprove)}>
              {approveLabel ?? m.approvalApprove}
            </Button>
            {canEdit && (
              <Button
                size="sm"
                variant="outlined"
                disabled={isPending}
                onPress={() => {
                  setDraft(json(args));
                  setEditing(true);
                }}
              >
                {editLabel ?? m.approvalEdit}
              </Button>
            )}
            <Button size="sm" variant="outlined" {...actionProps('denied')} onPress={() => act('denied', onDeny)}>
              {denyLabel ?? m.approvalDeny}
            </Button>
          </View>
        ))}
    </Surface>
  );
}

// ─── DiffView ────────────────────────────────────────────────────────────────

type DiffLineKind = 'hunk' | 'add' | 'del' | 'ctx';
interface DiffLine {
  kind: DiffLineKind;
  text: string;
  old?: number;
  new?: number;
}

const HUNK = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

/** Each line of a unified diff with its kind and, inside a hunk, its old and new line numbers (as web parseDiff). */
function parseDiff(diff: string): DiffLine[] {
  let a = 0;
  let b = 0;
  let inHunk = false;
  return diff
    .replace(/\n$/, '')
    .split('\n')
    .map((line): DiffLine => {
      if (line.startsWith('@@')) {
        const h = HUNK.exec(line);
        inHunk = !!h;
        if (h) {
          a = Number(h[1]);
          b = Number(h[2]);
        }
        return { kind: 'hunk', text: line };
      }
      const kind: DiffLineKind = line.startsWith('+') ? 'add' : line.startsWith('-') ? 'del' : 'ctx';
      const text = line.slice(1);
      if (!inHunk) return { kind, text };
      if (kind === 'add') return { kind, text, new: b++ };
      if (kind === 'del') return { kind, text, old: a++ };
      return { kind, text, old: a++, new: b++ };
    });
}

export interface DiffViewProps {
  /** A unified diff (lines starting with "+", "-" or " "); "@@" lines become headers. */
  diff: string;
  /** File name shown above the diff. */
  file?: string;
  /** Old and new line numbers in the gutter, counted from each `@@ -a,b +c,d @@` header. Not read by screen readers. */
  lineNumbers?: boolean;
  /** Strings for this diff ("Added: ", "Removed: "), over the provider's messages. */
  messages?: Partial<NexubMessages>;
  style?: StyleProp<ViewStyle>;
}

const LINE_ROLES: Record<DiffLineKind, [RoleName | undefined, RoleName]> = {
  add: ['success-container', 'on-success-container'],
  del: ['error-container', 'on-error-container'],
  hunk: [undefined, 'on-surface-variant'],
  ctx: [undefined, 'on-surface'],
};

function DiffLines({ lines, lineNumbers, m }: { lines: DiffLine[]; lineNumbers?: boolean; m: NexubMessages }) {
  const { roles, tokens } = useTheme();
  const gutter = { width: tokens.spacing[8], paddingEnd: tokens.spacing[2], textAlign: 'right' as const };
  return (
    <ScrollView horizontal style={{ direction: 'ltr', backgroundColor: roles.surface }}>
      <View style={{ paddingVertical: tokens.spacing[1], minWidth: '100%' }}>
        {lines.map(({ kind, text, old, new: next }, i) => {
          const [bg, fg] = LINE_ROLES[kind];
          const prefix = kind === 'add' ? m.diffAdded : kind === 'del' ? m.diffRemoved : '';
          return (
            <View
              key={i}
              // One element per line: "Added: text". The gutter and the sign are visual only.
              accessible
              accessibilityLabel={prefix + text}
              style={{
                flexDirection: 'row',
                paddingHorizontal: tokens.spacing[3],
                backgroundColor: bg ? roles[bg] : undefined,
              }}
            >
              {lineNumbers && (
                <>
                  <Text variant="body-sm" family="mono" color="on-surface-variant" tabular style={gutter}>
                    {old ?? ''}
                  </Text>
                  <Text variant="body-sm" family="mono" color="on-surface-variant" tabular style={gutter}>
                    {next ?? ''}
                  </Text>
                </>
              )}
              <Text variant="body-sm" family="mono" color={fg} style={{ width: tokens.spacing[4] }}>
                {kind === 'add' ? '+' : kind === 'del' ? '−' : ''}
              </Text>
              <Text variant="body-sm" family="mono" color={fg} style={{ writingDirection: 'ltr' }}>
                {text}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

/** A unified diff, with added and removed lines spelled out for screen readers. */
export function DiffView({ diff, file, lineNumbers, messages, style }: DiffViewProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const m = messages ? { ...theme.messages, ...messages } : theme.messages;
  const lines = React.useMemo(() => parseDiff(diff), [diff]);
  return (
    <View
      style={[
        { borderWidth: 1, borderColor: roles['outline-variant'], borderRadius: tokens.shape.container, overflow: 'hidden' },
        style,
      ]}
    >
      {file && (
        <Text
          variant="label-md"
          family="mono"
          style={{
            paddingHorizontal: tokens.spacing[3],
            paddingVertical: tokens.spacing['1-5'],
            backgroundColor: roles['surface-container-low'],
            borderBottomWidth: 1,
            borderBottomColor: roles['outline-variant'],
          }}
        >
          {file}
        </Text>
      )}
      <DiffLines lines={lines} lineNumbers={lineNumbers} m={m} />
    </View>
  );
}

// ─── DiffReview ──────────────────────────────────────────────────────────────

export interface DiffReviewFile {
  /** File path; also the key in `decisions`. */
  file: string;
  /** Unified diff for this file. */
  diff: string;
}

export type DiffDecision = 'accepted' | 'rejected';

export interface DiffReviewProps {
  files: DiffReviewFile[];
  /** Controlled decisions, keyed by file path. A file with no entry is still to review. */
  decisions?: Record<string, DiffDecision>;
  /** Starting decisions when uncontrolled. */
  defaultDecisions?: Record<string, DiffDecision>;
  onAccept?: (file: DiffReviewFile) => void;
  onReject?: (file: DiffReviewFile) => void;
  /** Called with the whole record after each decision. */
  onDecisionsChange?: (decisions: Record<string, DiffDecision>) => void;
  /** Show old and new line numbers in each diff. @default true */
  lineNumbers?: boolean;
  /** Files start expanded. @default true */
  defaultOpen?: boolean;
  style?: StyleProp<ViewStyle>;
}

function FileRow({
  f,
  decision,
  open,
  onToggle,
  onDecide,
  lineNumbers,
}: {
  f: DiffReviewFile;
  decision: DiffDecision | undefined;
  open: boolean;
  onToggle: () => void;
  onDecide: (d: DiffDecision) => void;
  lineNumbers: boolean;
}) {
  const { roles, tokens, dir, messages: m } = useTheme();
  const lines = React.useMemo(() => parseDiff(f.diff), [f.diff]);
  const added = lines.filter((l) => l.kind === 'add').length;
  const removed = lines.filter((l) => l.kind === 'del').length;
  const toggle = (d: DiffDecision) => (
    <Button
      size="sm"
      variant={decision === d ? 'tonal' : 'outlined'}
      accessibilityLabel={d === 'accepted' ? m.diffAcceptFile(f.file) : m.diffRejectFile(f.file)}
      accessibilityState={{ selected: decision === d }}
      onPress={() => onDecide(d)}
    >
      {d === 'accepted' ? m.diffAccept : m.diffReject}
    </Button>
  );
  return (
    <View style={{ borderWidth: 1, borderColor: roles['outline-variant'], borderRadius: tokens.shape.container, overflow: 'hidden' }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: tokens.spacing[2],
          padding: tokens.spacing['1-5'],
          backgroundColor: roles['surface-container-low'],
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={[f.file, m.diffLineCounts(added, removed), decision && m.diffDecision[decision]].filter(Boolean).join(', ')}
          accessibilityState={{ expanded: open }}
          onPress={onToggle}
          pressScale={false}
          // The file line takes the full width; Accept and Reject wrap to the line below, so a
          // phone never squeezes the file name, counts and decision into one row.
          style={{ flexBasis: '100%', minHeight: tokens.size.control.lg, flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[2] }}
        >
          <View style={{ transform: [{ rotate: open ? '0deg' : dir === 'rtl' ? '90deg' : '-90deg' }] }}>
            <ChevronDown size="sm" color={roles['on-surface-variant']} />
          </View>
          <Text variant="label-md" family="mono" numberOfLines={1} style={{ flexShrink: 1 }}>
            {f.file}
          </Text>
          <Text variant="label-sm" family="mono" tabular color="success">{`+${added}`}</Text>
          <Text variant="label-sm" family="mono" tabular color="error">{`−${removed}`}</Text>
          {decision && (
            <Text variant="label-sm" color="on-surface-variant" style={{ marginStart: 'auto' }}>
              {m.diffDecision[decision]}
            </Text>
          )}
        </Pressable>
        <View style={{ flexDirection: 'row', gap: tokens.spacing[1], marginStart: 'auto' }}>
          {toggle('accepted')}
          {toggle('rejected')}
        </View>
      </View>
      {open && (
        <View style={{ borderTopWidth: 1, borderTopColor: roles['outline-variant'] }}>
          <DiffLines lines={lines} lineNumbers={lineNumbers} m={m} />
        </View>
      )}
    </View>
  );
}

/** Review an agent's changes file by file: expand a diff, accept or reject it, see what's left. */
export function DiffReview({
  files,
  decisions: controlled,
  defaultDecisions,
  onAccept,
  onReject,
  onDecisionsChange,
  lineNumbers = true,
  defaultOpen = true,
  style,
}: DiffReviewProps) {
  const { tokens, messages: m } = useTheme();
  const [own, setOwn] = React.useState<Record<string, DiffDecision>>(defaultDecisions ?? {});
  const decisions = controlled ?? own;
  const [openFiles, setOpenFiles] = React.useState<Record<string, boolean>>({});

  const decide = (f: DiffReviewFile, d: DiffDecision) => {
    if (decisions[f.file] === d) return;
    const next = { ...decisions, [f.file]: d };
    if (!controlled) setOwn(next);
    (d === 'accepted' ? onAccept : onReject)?.(f);
    onDecisionsChange?.(next);
  };

  const accepted = files.filter((f) => decisions[f.file] === 'accepted').length;
  const rejected = files.filter((f) => decisions[f.file] === 'rejected').length;
  const summary = m.diffReviewSummary(accepted, rejected, files.length - accepted - rejected);
  useAnnounce(summary);

  return (
    <View style={[{ gap: tokens.spacing[2] }, style]}>
      <Text variant="label-md" color="on-surface-variant">
        {summary}
      </Text>
      {files.map((f) => (
        <FileRow
          key={f.file}
          f={f}
          decision={decisions[f.file]}
          open={openFiles[f.file] ?? defaultOpen}
          onToggle={() => setOpenFiles((o) => ({ ...o, [f.file]: !(o[f.file] ?? defaultOpen) }))}
          onDecide={(d) => decide(f, d)}
          lineNumbers={lineNumbers}
        />
      ))}
    </View>
  );
}
