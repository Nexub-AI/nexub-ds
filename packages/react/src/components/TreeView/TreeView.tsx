'use client';

import * as React from 'react';
import { Check, ChevronRight, Minus } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { Spinner } from '../Spinner/Spinner.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  /** Text for type-ahead when `label` isn't a string. */
  textValue?: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  /** Children exist but aren't loaded yet: expanding calls `onLoadChildren`. */
  hasChildren?: boolean;
  disabled?: boolean;
}

export interface TreeViewProps extends DataStateProps {
  nodes: TreeNode[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Single selection (ignored when `checkable`). */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  /** Checkboxes with tri-state parents; `checked` lists every checked id, parents included. */
  checkable?: boolean;
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (ids: string[]) => void;
  /** Load a `hasChildren` node's children, then pass them in through `nodes`. */
  onLoadChildren?: (node: TreeNode) => Promise<unknown>;
  className?: string;
}

interface Flat {
  node: TreeNode;
  level: number;
  parent: string | null;
}

// Row indent per level (0.25rem + 1.25rem a level) as classes, so the server
// HTML is already indented (no shift on mount) and strict CSP needs no style
// attribute. Deeper levels fall back to setting it through the CSSOM.
const INDENT = [
  'ps-[0.25rem]', 'ps-[1.5rem]', 'ps-[2.75rem]', 'ps-[4rem]', 'ps-[5.25rem]', 'ps-[6.5rem]', 'ps-[7.75rem]', 'ps-[9rem]',
];

const hasKids = (n: TreeNode) => Boolean(n.children?.length || (n.hasChildren && !n.children));
const text = (n: TreeNode) => n.textValue ?? (typeof n.label === 'string' ? n.label : '');
const descendants = (n: TreeNode): string[] =>
  (n.children ?? []).flatMap((c) => [c.id, ...descendants(c)]);

/**
 * A hierarchy people can browse with the keyboard (ARIA tree): Arrow keys move
 * and expand, Home/End jump, typing finds an item. Optional lazy children and
 * tri-state checkboxes.
 */
export function TreeView({
  nodes,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  checkable = false,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  onLoadChildren,
  className,
  loading: rootLoading,
  emptyState,
  errorState,
  ...aria
}: TreeViewProps) {
  const messages = useNexubMessages();
  const [expanded = [], setExpanded] = useControllableState<string[]>({
    value: expandedProp,
    defaultValue: defaultExpanded ?? [],
    onChange: onExpandedChange,
  });
  const [selected = null, setSelected] = useControllableState<string | null>({
    value: selectedProp,
    defaultValue: defaultSelected ?? null,
    onChange: onSelectedChange,
  });
  const [checked = [], setChecked] = useControllableState<string[]>({
    value: checkedProp,
    defaultValue: defaultChecked ?? [],
    onChange: onCheckedChange,
  });
  const [loading, setLoading] = React.useState<string | null>(null);
  const [focused, setFocused] = React.useState<string | null>(null);
  // Groups kept mounted while their collapse transition runs.
  const [closing, setClosing] = React.useState<ReadonlySet<string>>(() => new Set());
  const groups = React.useRef(new Map<string, HTMLDivElement>());
  // Groups open on first paint must not slide open (that would be a layout shift); later ones do.
  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
  }, []);
  const refs = React.useRef(new Map<string, HTMLLIElement>());
  const typed = React.useRef({ text: '', at: 0 });

  const open = React.useMemo(() => new Set(expanded), [expanded]);
  const checkedSet = React.useMemo(() => new Set(checked), [checked]);

  // Every loaded node with its parent, plus the visible ones in order.
  const { all, visible } = React.useMemo(() => {
    const all = new Map<string, Flat>();
    const visible: Flat[] = [];
    const walk = (list: TreeNode[], level: number, parent: string | null, shown: boolean) => {
      for (const node of list) {
        const flat = { node, level, parent };
        all.set(node.id, flat);
        if (shown) visible.push(flat);
        if (node.children) walk(node.children, level + 1, node.id, shown && open.has(node.id));
      }
    };
    walk(nodes, 1, null, true);
    return { all, visible };
  }, [nodes, open]);

  const tabStop =
    (focused && visible.some((f) => f.node.id === focused) && focused) ||
    (selected && visible.some((f) => f.node.id === selected) && selected) ||
    visible[0]?.node.id;

  const focus = (id: string | undefined) => {
    if (!id) return;
    setFocused(id);
    refs.current.get(id)?.focus();
  };

  const toggle = async (node: TreeNode, to = !open.has(node.id)) => {
    if (!hasKids(node) || to === open.has(node.id)) return;
    if (!to) {
      // Only when a transition will run (not under reduced motion), or its end would never unmount the group.
      const group = groups.current.get(node.id);
      if (group && parseFloat(getComputedStyle(group).transitionDuration) > 0) setClosing((s) => new Set(s).add(node.id));
    }
    setExpanded(to ? [...expanded, node.id] : expanded.filter((id) => id !== node.id));
    if (to && node.hasChildren && !node.children && onLoadChildren) {
      setLoading(node.id);
      try {
        await onLoadChildren(node);
      } finally {
        setLoading((id) => (id === node.id ? null : id));
      }
    }
  };

  const toggleCheck = (node: TreeNode) => {
    const next = new Set(checkedSet);
    const on = !next.has(node.id);
    for (const id of [node.id, ...descendants(node)]) {
      if (on) next.add(id);
      else next.delete(id);
    }
    // A parent is checked exactly when all its children are.
    for (let p = all.get(node.id)?.parent; p; p = all.get(p)?.parent ?? null) {
      const kids = all.get(p)!.node.children ?? [];
      if (kids.every((k) => next.has(k.id))) next.add(p);
      else next.delete(p);
    }
    setChecked([...next]);
  };

  const activate = (node: TreeNode) => {
    if (node.disabled) return;
    if (checkable) toggleCheck(node);
    else setSelected(node.id);
  };

  const onKeyDown = (e: React.KeyboardEvent, flat: Flat) => {
    const { node } = flat;
    const i = visible.findIndex((f) => f.node.id === node.id);
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const flip: Record<string, string> = { ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' };
    const key = rtl ? (flip[e.key] ?? e.key) : e.key;
    let handled = true;
    switch (key) {
      case 'ArrowDown':
        focus(visible[i + 1]?.node.id);
        break;
      case 'ArrowUp':
        focus(visible[i - 1]?.node.id);
        break;
      case 'Home':
        focus(visible[0]?.node.id);
        break;
      case 'End':
        focus(visible.at(-1)?.node.id);
        break;
      case 'ArrowRight':
        if (hasKids(node) && !open.has(node.id)) void toggle(node, true);
        else if (open.has(node.id)) focus(node.children?.[0]?.id);
        break;
      case 'ArrowLeft':
        if (open.has(node.id)) void toggle(node, false);
        else focus(flat.parent ?? undefined);
        break;
      case 'Enter':
      case ' ':
        activate(node);
        break;
      default: {
        handled = false;
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) break;
        const now = Date.now();
        const t = typed.current;
        t.text = (now - t.at > 500 ? '' : t.text) + e.key.toLowerCase();
        t.at = now;
        const order = [...visible.slice(i + 1), ...visible.slice(0, i + 1)];
        const hit = order.find((f) => text(f.node).toLowerCase().startsWith(t.text));
        if (hit) {
          focus(hit.node.id);
          handled = true;
        }
      }
    }
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const render = (list: TreeNode[], level: number, parent: string | null): React.ReactNode =>
    list.map((node, index) => {
      const kids = hasKids(node);
      const isOpen = open.has(node.id);
      const isChecked = checkedSet.has(node.id);
      const mixed = !isChecked && descendants(node).some((id) => checkedSet.has(id));
      const flat = { node, level, parent };
      return (
        <li
          key={node.id}
          ref={(el) => {
            if (el) refs.current.set(node.id, el);
            else refs.current.delete(node.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-setsize={list.length}
          aria-posinset={index + 1}
          aria-expanded={kids ? isOpen : undefined}
          aria-selected={checkable ? undefined : selected === node.id}
          aria-checked={checkable ? (mixed ? 'mixed' : isChecked) : undefined}
          aria-disabled={node.disabled || undefined}
          aria-busy={loading === node.id || undefined}
          tabIndex={tabStop === node.id ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, flat)}
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocused(node.id);
          }}
          className="outline-none [&:focus-visible>div:first-child]:outline [&:focus-visible>div:first-child]:outline-2 [&:focus-visible>div:first-child]:-outline-offset-2 [&:focus-visible>div:first-child]:outline-[var(--color-primary)]"
        >
          <div
            ref={
              INDENT[level - 1]
                ? undefined
                : (el) => {
                    // CSSOM so strict-CSP pages still get the indent.
                    if (el) el.style.paddingInlineStart = `${(level - 1) * 1.25 + 0.25}rem`;
                  }
            }
            onClick={() => {
              focus(node.id);
              if (kids && !checkable) void toggle(node);
              activate(node);
            }}
            className={cn(
              'flex min-h-control-sm cursor-default items-center gap-1.5 rounded-shape-control pe-2 text-body-md text-[var(--color-on-surface)]',
              INDENT[level - 1],
              'hover:bg-[var(--color-surface-container-high)]',
              !checkable &&
                selected === node.id &&
                'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] hover:bg-[var(--color-secondary-container)]',
              node.disabled && 'cursor-not-allowed text-[var(--color-text-disabled)] hover:bg-transparent',
            )}
          >
            <span
              aria-hidden="true"
              onClick={(e) => {
                if (!kids) return;
                e.stopPropagation();
                focus(node.id);
                void toggle(node);
              }}
              className="inline-flex size-5 shrink-0 items-center justify-center text-[var(--color-on-surface-variant)]"
            >
              {loading === node.id ? (
                <Spinner size="xs" />
              ) : kids ? (
                <ChevronRight
                  size="xs"
                  className={cn('transition-transform rtl:-scale-x-100', isOpen && 'rotate-90 rtl:-rotate-90')}
                />
              ) : null}
            </span>
            {checkable && (
              <span
                aria-hidden="true"
                className={cn(
                  'inline-flex size-4 shrink-0 items-center justify-center rounded-shape-min border-2',
                  isChecked || mixed
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'border-[var(--color-outline)]',
                )}
              >
                {isChecked ? <Check size="xs" /> : mixed ? <Minus size="xs" /> : null}
              </span>
            )}
            {node.icon && (
              <span aria-hidden="true" className="inline-flex shrink-0 text-[var(--color-on-surface-variant)]">
                {node.icon}
              </span>
            )}
            <span className="truncate">{node.label}</span>
          </div>
          {kids && node.children && (isOpen || closing.has(node.id)) && (
            // Rows 0fr → 1fr: the group slides open on mount (@starting-style) and shut before it unmounts.
            <div
              ref={(el) => {
                if (el) groups.current.set(node.id, el);
                else groups.current.delete(node.id);
              }}
              aria-hidden={isOpen ? undefined : true}
              onTransitionEnd={(e) => {
                if (e.target !== e.currentTarget || isOpen) return;
                setClosing((s) => {
                  const next = new Set(s);
                  // Its descendants too: theirs never end once this one unmounts.
                  for (const id of [node.id, ...descendants(node)]) next.delete(id);
                  return next;
                });
              }}
              className={cn(
                'grid transition-[grid-template-rows] duration-spatial-default ease-spatial-default motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'pointer-events-none grid-rows-[0fr]',
                isOpen && mounted.current && '[@starting-style]:grid-rows-[0fr]',
              )}
            >
              <ul role="group" className="m-0 min-h-0 list-none overflow-hidden p-0">
                {render(node.children, level + 1, node.id)}
              </ul>
            </div>
          )}
        </li>
      );
    });

  const states = { loading: rootLoading, emptyState, errorState };
  const state = dataState(
    states,
    nodes.length === 0,
    [0, 1, 2, 3].map((i) => (
      <span key={i} className="flex min-h-control-sm items-center ps-[0.25rem] pe-2 text-body-md">
        <Skeleton className={i % 2 ? 'w-1/2' : 'w-3/4'} />
      </span>
    )),
    messages.emptyStates.noData.title,
  );
  if (state != null) {
    // Not a tree while there are no items: a tree must own treeitems.
    return (
      <div role="group" aria-busy={dataBusy(states)} className={cn('flex flex-col', className)} {...aria}>
        {state}
      </div>
    );
  }

  return (
    <ul
      role="tree"
      aria-multiselectable={checkable || undefined}
      className={cn('m-0 flex list-none flex-col p-0', className)}
      {...aria}
    >
      {render(nodes, 1, null)}
    </ul>
  );
}
