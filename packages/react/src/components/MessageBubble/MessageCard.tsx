'use client';

import * as React from 'react';
import { MoreHorizontal } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { Button } from '../Button/Button.js';
import { IconButton } from '../IconButton/IconButton.js';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu.js';
import { DescriptionList } from '../DescriptionList/DescriptionList.js';
import { SuccessCheck } from '../SuccessCheck/SuccessCheck.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { defaultMessageStrings, type MessageStrings } from './MessageBubble.js';

export interface MessageCardAction {
  /** The button text (and the menu item's). */
  label: string;
  onSelect: () => void;
  /**
   * At most one action is `filled`: the first one asked for, or else the first without a
   * variant. The others are `tonal` unless they ask for `text`.
   */
  variant?: 'filled' | 'tonal' | 'text';
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface MessageCardField {
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface MessageCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  /** Beside the title, usually a `Badge`. */
  status?: React.ReactNode;
  /** Label and value pairs, as a `dl`: two columns, one when the card is narrow. */
  fields?: MessageCardField[];
  /** Free content under the fields. */
  body?: React.ReactNode;
  /**
   * A list renders as buttons: one `filled` at most, and past two the rest go into a
   * "More actions" menu. Any other node renders as given, in the action row.
   */
  actions?: MessageCardAction[] | React.ReactNode;
  /** Clip the fields and body to this height (a number is px), with a "Show all" toggle. */
  maxHeight?: number | string;
  /** Replaces the actions with one line and a check, e.g. "Approved by you · 2:14 pm". */
  done?: React.ReactNode;
  messages?: Partial<MessageStrings>;
}

const FADE = '[mask-image:linear-gradient(to_bottom,var(--color-surface)_calc(100%-2rem),transparent)]';

function isActionList(actions: unknown): actions is MessageCardAction[] {
  return (
    Array.isArray(actions) &&
    actions.length > 0 &&
    actions.every((a) => a != null && typeof a === 'object' && !React.isValidElement(a) && 'onSelect' in a)
  );
}

/** Variants and the menu split, by the rules on `MessageCardAction.variant`. */
function planActions(actions: MessageCardAction[]) {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    if (actions.filter((a) => a.variant === 'filled').length > 1)
      console.warn('MessageCard: more than one action has variant="filled". Only the first is filled; the others render tonal.');
  }
  let primary = actions.findIndex((a) => a.variant === 'filled');
  if (primary < 0) primary = actions.findIndex((a) => a.variant == null);
  const variants = actions.map((a, i) => (i === primary ? 'filled' : a.variant === 'text' ? 'text' : 'tonal'));
  // Two stay visible, always including the filled one; the rest go into the menu, in order.
  const visible = new Set<number>(primary >= 0 && actions.length > 2 ? [primary] : []);
  for (let i = 0; i < actions.length && visible.size < 2; i++) visible.add(i);
  return { variants, visible };
}

/**
 * 12.2: a bordered block inside a MessageBubble: a request, a record, an approval. Title and
 * status, label/value fields, a body, and actions that turn into a "done" line once handled.
 */
export const MessageCard = React.forwardRef<HTMLDivElement, MessageCardProps>(
  ({ title, status, fields, body, actions, maxHeight, done, messages, className, ...props }, ref) => {
    const m = { ...defaultMessageStrings, ...useNexubMessages(), ...messages };
    const contentId = React.useId();
    const [contentEl, setContentEl] = React.useState<HTMLDivElement | null>(null);
    const [expanded, setExpanded] = React.useState(false);
    const [overflows, setOverflows] = React.useState(false);
    const limit = maxHeight == null ? undefined : typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
    const clipped = limit != null && !expanded;

    // Through the CSSOM, not a style attribute, so a strict CSP allows it.
    useIsomorphicLayoutEffect(() => {
      if (!contentEl) return;
      if (clipped) contentEl.style.setProperty('max-height', limit!);
      else contentEl.style.removeProperty('max-height');
    }, [contentEl, clipped, limit]);

    React.useEffect(() => {
      if (!contentEl || limit == null) return;
      const measure = () => {
        if (!expanded) setOverflows(contentEl.scrollHeight > contentEl.clientHeight + 1);
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(measure);
      ro.observe(contentEl);
      return () => ro.disconnect();
    }, [contentEl, limit, expanded, fields, body]);

    const hasContent = (fields && fields.length > 0) || body != null;

    let actionRow: React.ReactNode = null;
    if (done != null) {
      actionRow = (
        <p role="status" className="m-0 flex items-center gap-2 text-label-md text-[var(--color-on-surface-muted)]">
          <SuccessCheck size="sm" className="size-5 [&>svg]:size-3" />
          <span>{done}</span>
        </p>
      );
    } else if (isActionList(actions)) {
      const { variants, visible } = planActions(actions);
      const extra = actions.filter((_, i) => !visible.has(i));
      actionRow = (
        <div className="flex flex-wrap items-center gap-2">
          {actions.map((a, i) =>
            visible.has(i) ? (
              <Button key={a.label} size="sm" variant={variants[i] as 'filled' | 'tonal' | 'text'} leadingIcon={a.icon} disabled={a.disabled} onClick={a.onSelect}>
                {a.label}
              </Button>
            ) : null,
          )}
          {extra.length > 0 && (
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger asChild>
                <IconButton size="sm" label={m.moreActions}>
                  <MoreHorizontal size="sm" aria-hidden="true" />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                {extra.map((a) => (
                  <DropdownMenu.Item key={a.label} disabled={a.disabled} onSelect={a.onSelect}>
                    {a.icon}
                    {a.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </div>
      );
    } else if (actions != null && !(Array.isArray(actions) && actions.length === 0)) {
      actionRow = <div className="flex flex-wrap items-center gap-2">{actions as React.ReactNode}</div>;
    }

    return (
      <div
        ref={ref}
        className={cn(
          '@container flex flex-col gap-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-4 text-body-md text-[var(--color-on-surface)] whitespace-normal',
          className,
        )}
        {...props}
      >
        {(title != null || status != null) && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {title != null && <div className="min-w-0 text-title-sm font-medium">{title}</div>}
            {status}
          </div>
        )}
        {hasContent && (
          <div>
            <div
              id={contentId}
              ref={setContentEl}
              className={cn('flex flex-col gap-2', clipped && 'overflow-hidden', clipped && overflows && FADE)}
            >
              {fields && fields.length > 0 && (
                <DescriptionList.Root layout="stacked" columns={2} size="sm">
                  {fields.map((f, i) => (
                    <DescriptionList.Item key={i} label={f.label}>
                      {f.value}
                    </DescriptionList.Item>
                  ))}
                </DescriptionList.Root>
              )}
              {body != null && <div>{body}</div>}
            </div>
            {limit != null && (overflows || expanded) && (
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={contentId}
                onClick={() => setExpanded((e) => !e)}
                className="nx-state-layer -mx-1 mt-1 rounded-shape-min px-1 text-label-md font-medium text-[var(--color-primary)] underline underline-offset-2"
              >
                {expanded ? m.showLess : m.showAll}
              </button>
            )}
          </div>
        )}
        {actionRow}
      </div>
    );
  },
);
MessageCard.displayName = 'MessageCard';
