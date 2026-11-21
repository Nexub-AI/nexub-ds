'use client';

import * as React from 'react';
import { ChevronDown } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { Avatar } from '../Avatar/Avatar.js';
import { TreeView, type TreeNode } from '../TreeView/TreeView.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

/** A TreeView node with a role line and a photo. */
export interface OrgChartNode extends TreeNode {
  /** The second line on the card, usually the role. */
  description?: React.ReactNode;
  /** Photo URL; the name's initials show without one. */
  avatar?: string;
  children?: OrgChartNode[];
}

export interface OrgChartProps {
  nodes: OrgChartNode[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Click or Enter on a card, e.g. to open the person's profile. */
  onActivate?: (node: OrgChartNode) => void;
  /** Replaces the card's content (photo, name, role). The expand control stays. */
  renderCard?: (node: OrgChartNode) => React.ReactNode;
  className?: string;
}

interface Flat {
  node: OrgChartNode;
  parent: string | null;
}

const text = (n: TreeNode) => n.textValue ?? (typeof n.label === 'string' ? n.label : '');
const OUTLINE =
  '[&:focus-visible>div:first-child]:outline [&:focus-visible>div:first-child]:outline-2 [&:focus-visible>div:first-child]:outline-offset-2 [&:focus-visible>div:first-child]:outline-[var(--color-primary)]';
// Connectors in CSS: each child draws half of the bar above it (::before to the start side, ::after to the end
// side plus the drop to its card); the first and last drop their outer half. Logical, so RTL mirrors.
const LINE = 'before:border-[var(--color-outline-variant)] after:border-[var(--color-outline-variant)]';
const CHILD = cn(
  "pt-5 before:absolute before:top-0 before:end-1/2 before:h-5 before:w-1/2 before:border-t before:content-[''] first:before:border-t-0",
  "after:absolute after:top-0 after:start-1/2 after:h-5 after:w-1/2 after:border-s after:border-t after:content-[''] last:after:border-t-0",
  LINE,
);
const GROUP =
  "relative m-0 flex list-none p-0 pt-5 before:absolute before:top-0 before:start-1/2 before:h-5 before:border-s before:border-[var(--color-outline-variant)] before:content-['']";

const toTree = (n: OrgChartNode): TreeNode => ({
  id: n.id,
  label: (
    <>
      {n.label}
      {n.description != null && <span className="ms-2 text-body-sm text-[var(--color-on-surface-variant)]">{n.description}</span>}
    </>
  ),
  textValue: text(n),
  icon: <Avatar size="xs" src={n.avatar} name={text(n) || undefined} aria-hidden />,
  disabled: n.disabled,
  children: n.children?.map(toTree),
});

/**
 * People top-down as cards joined by lines, keyboard navigable as an ARIA tree.
 * Below 768px it renders the same nodes as a TreeView. Wide charts scroll inside their own box.
 */
export function OrgChart({
  nodes,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  onActivate,
  renderCard,
  className,
  ...aria
}: OrgChartProps) {
  const messages = useNexubMessages();
  const narrow = useMediaQuery('(max-width: 47.99rem)');
  const uid = React.useId();
  const [expanded = [], setExpanded] = useControllableState<string[]>({
    value: expandedProp,
    defaultValue: defaultExpanded ?? [],
    onChange: onExpandedChange,
  });
  const [focused, setFocused] = React.useState<string | null>(null);
  const refs = React.useRef(new Map<string, HTMLLIElement>());
  const open = React.useMemo(() => new Set(expanded), [expanded]);

  // Every node by id (for the narrow view's callbacks) and the visible ones in tree order.
  const { all, visible } = React.useMemo(() => {
    const all = new Map<string, Flat>();
    const visible: Flat[] = [];
    const walk = (list: OrgChartNode[], parent: string | null, shown: boolean) => {
      for (const node of list) {
        const flat = { node, parent };
        all.set(node.id, flat);
        if (shown) visible.push(flat);
        if (node.children) walk(node.children, node.id, shown && open.has(node.id));
      }
    };
    walk(nodes, null, true);
    return { all, visible };
  }, [nodes, open]);
  const treeNodes = React.useMemo(() => nodes.map(toTree), [nodes]);

  if (narrow) {
    return (
      <TreeView
        {...aria}
        nodes={treeNodes}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onActivate={onActivate && ((n) => onActivate(all.get(n.id)!.node))}
        className={className}
      />
    );
  }

  const tabStop = (focused && visible.some((f) => f.node.id === focused) && focused) || visible[0]?.node.id;
  const focus = (id: string | null | undefined) => {
    if (!id) return;
    setFocused(id);
    refs.current.get(id)?.focus();
  };
  const toggle = (node: OrgChartNode, to = !open.has(node.id)) => {
    if (!node.children?.length || to === open.has(node.id)) return;
    setExpanded(to ? [...expanded, node.id] : expanded.filter((id) => id !== node.id));
  };

  const onKeyDown = (e: React.KeyboardEvent, { node, parent }: Flat) => {
    if (e.target !== e.currentTarget) return;
    const i = visible.findIndex((f) => f.node.id === node.id);
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const flip: Record<string, string> = { ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' };
    const isOpen = open.has(node.id);
    switch (rtl ? (flip[e.key] ?? e.key) : e.key) {
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
        if (node.children?.length && !isOpen) toggle(node, true);
        else if (isOpen) focus(node.children?.[0]?.id);
        break;
      case 'ArrowLeft':
        if (isOpen) toggle(node, false);
        else focus(parent);
        break;
      case 'Enter':
        if (!node.disabled) onActivate?.(node);
        break;
      case ' ':
        toggle(node);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const render = (list: OrgChartNode[], level: number, parent: string | null): React.ReactNode =>
    list.map((node, index) => {
      const count = node.children?.length ?? 0;
      const isOpen = open.has(node.id);
      const labelId = `${uid}-${encodeURIComponent(node.id)}`;
      return (
        <li
          key={node.id}
          ref={(el) => {
            if (el) refs.current.set(node.id, el);
            else refs.current.delete(node.id);
          }}
          role="treeitem"
          // Name and role as separate ids, so the name reads "Ada Lovelace CEO", not run together.
          aria-labelledby={renderCard || node.description == null ? labelId : `${labelId} ${labelId}-d`}
          aria-level={level}
          aria-setsize={list.length}
          aria-posinset={index + 1}
          aria-expanded={count ? isOpen : undefined}
          aria-disabled={node.disabled || undefined}
          tabIndex={tabStop === node.id ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, { node, parent })}
          onFocus={(e) => {
            if (e.target === e.currentTarget) setFocused(node.id);
          }}
          className={cn('relative flex flex-col items-center px-2 outline-none', OUTLINE, level > 1 && CHILD)}
        >
          <div
            onClick={() => {
              focus(node.id);
              if (!node.disabled) onActivate?.(node);
            }}
            className={cn(
              'flex w-52 flex-col items-center gap-2 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-3 text-center text-[var(--color-on-surface)]',
              onActivate && !node.disabled && 'cursor-pointer hover:bg-[var(--color-surface-container-high)]',
              node.disabled && 'text-[var(--color-text-disabled)]',
            )}
          >
            {renderCard ? (
              <div id={labelId} className="w-full">
                {renderCard(node)}
              </div>
            ) : (
              <>
                <Avatar size="lg" src={node.avatar} name={text(node) || undefined} aria-hidden />
                <span className="flex min-w-0 max-w-full flex-col">
                  <span id={labelId} className="truncate text-title-sm">
                    {node.label}
                  </span>
                  {node.description != null && (
                    <span id={`${labelId}-d`} className="truncate text-body-sm text-[var(--color-on-surface-variant)]">
                      {node.description}
                    </span>
                  )}
                </span>
              </>
            )}
            {count > 0 && (
              // Pointer shortcut; keyboard and screen readers use the item's aria-expanded (Space, arrows).
              <span
                aria-hidden="true"
                onClick={(e) => {
                  e.stopPropagation();
                  focus(node.id);
                  toggle(node);
                }}
                className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-full bg-[var(--color-surface-container-high)] px-2 text-label-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-highest)]"
              >
                {messages.orgChartReports(count)}
                <ChevronDown size="xs" className={cn('transition-transform motion-reduce:transition-none', isOpen && 'rotate-180')} />
              </span>
            )}
          </div>
          {count > 0 && isOpen && (
            <ul role="group" className={GROUP}>
              {render(node.children!, level + 1, node.id)}
            </ul>
          )}
        </li>
      );
    });

  return (
    // relative: keeps absolutely placed descendants (sr-only text in custom cards) inside the scroller, so they can't widen the page.
    <div className={cn('relative overflow-x-auto', className)}>
      <ul role="tree" className="m-0 flex w-max min-w-full list-none justify-center gap-6 p-2" {...aria}>
        {render(nodes, 1, null)}
      </ul>
    </div>
  );
}
