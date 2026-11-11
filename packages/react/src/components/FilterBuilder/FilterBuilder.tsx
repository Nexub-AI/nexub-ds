'use client';

import * as React from 'react';
import { Plus, X } from '@nexub/icons';
import {
  countFilters,
  emptyFilter,
  filterId as uid,
  filterOperators,
  isFilterGroup,
  newFilterRule,
  type FilterField,
  type FilterFieldType,
  type FilterGroup,
  type FilterOperator,
  type FilterRule,
} from '@nexub/core';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Button } from '../Button/Button.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Input } from '../Input/Input.js';
import { Select } from '../Select/Select.js';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl.js';

export type { FilterFieldType, FilterOperator, FilterField, FilterRule, FilterGroup };
export { filterOperators, isFilterGroup, emptyFilter, countFilters };

export interface FilterBuilderProps {
  fields: FilterField[];
  value?: FilterGroup;
  defaultValue?: FilterGroup;
  onValueChange?: (value: FilterGroup) => void;
  /** How many levels of nested groups "Add group" may create. Default 1; 0 hides it. */
  maxDepth?: number;
  className?: string;
}

/**
 * Builds an AND/OR filter query as plain JSON. Nexub doesn't run it: send it
 * to your API or evaluate it yourself.
 */
export function FilterBuilder({ fields, value: valueProp, defaultValue, onValueChange, maxDepth = 1, className }: FilterBuilderProps) {
  const [value = emptyFilter(), setValue] = useControllableState<FilterGroup>({
    value: valueProp,
    defaultValue: defaultValue ?? emptyFilter(),
    onChange: onValueChange,
  });
  // Edits apply to the latest value; the (possibly large) tree renders a deferred
  // copy so typing in a rule's value stays responsive. onValueChange still fires per edit.
  const latest = React.useRef(value);
  useIsomorphicLayoutEffect(() => {
    latest.current = value;
  });
  const update = React.useCallback((fn: Updater<FilterGroup>) => setValue(fn(latest.current)), [setValue]);
  const deferred = React.useDeferredValue(value);
  return (
    <MemoGroupView
      group={deferred}
      fields={fields}
      depth={0}
      maxDepth={maxDepth}
      onChange={update}
      className={className}
    />
  );
}

FilterBuilder.displayName = 'FilterBuilder';

type Updater<T> = (prev: T) => T;

interface GroupViewProps {
  group: FilterGroup;
  fields: FilterField[];
  depth: number;
  maxDepth: number;
  /** Takes an updater so edits made while the rendered tree lags never drop newer ones. */
  onChange: (fn: Updater<FilterGroup>) => void;
  onRemove?: () => void;
  className?: string;
}

function GroupView({ group, fields, depth, maxDepth, onChange, onRemove, className }: GroupViewProps) {
  const t = useNexubMessages();
  const first = fields[0];
  const setRules = (fn: Updater<FilterGroup['rules']>) => onChange((g) => ({ ...g, rules: fn(g.rules) }));
  const newRule = () => newFilterRule(first);

  return (
    <div
      role="group"
      aria-label={t.filterGroup(group.combinator)}
      className={cn(
        'flex flex-col gap-2',
        depth > 0 && 'rounded-shape-container border border-[var(--color-outline-variant)] p-3',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <SegmentedControl.Root
          size="sm"
          aria-label={t.filterGroup(group.combinator)}
          value={group.combinator}
          onValueChange={(v) => v && onChange((g) => ({ ...g, combinator: v as 'and' | 'or' }))}
        >
          <SegmentedControl.Item value="and">{t.matchAll}</SegmentedControl.Item>
          <SegmentedControl.Item value="or">{t.matchAny}</SegmentedControl.Item>
        </SegmentedControl.Root>
        {onRemove && (
          <IconButton label={t.removeGroup} variant="ghost" size="sm" className="ms-auto" onClick={onRemove}>
            <X size="sm" aria-hidden="true" />
          </IconButton>
        )}
      </div>

      {group.rules.map((r) => {
        const replace = <T extends FilterRule | FilterGroup>(fn: Updater<T>) =>
          setRules((rules) => rules.map((x) => (x.id === r.id ? fn(x as T) : x)));
        const remove = () => setRules((rules) => rules.filter((x) => x.id !== r.id));
        return isFilterGroup(r) ? (
          <GroupView key={r.id} group={r} fields={fields} depth={depth + 1} maxDepth={maxDepth} onChange={replace} onRemove={remove} />
        ) : (
          <RuleRow key={r.id} rule={r} fields={fields} onChange={replace} onRemove={remove} />
        );
      })}

      <div className="flex flex-wrap gap-2">
        <Button variant="text" size="sm" onClick={() => setRules((rules) => [...rules, newRule()])} disabled={!first}>
          <Plus size="sm" aria-hidden="true" />
          {t.addFilter}
        </Button>
        {depth < maxDepth && (
          <Button
            variant="text"
            size="sm"
            onClick={() => setRules((rules) => [...rules, { id: uid(), combinator: 'and', rules: [newRule()] }])}
            disabled={!first}
          >
            <Plus size="sm" aria-hidden="true" />
            {t.addGroup}
          </Button>
        )}
      </div>
    </div>
  );
}

const MemoGroupView = React.memo(GroupView);

function RuleRow({
  rule,
  fields,
  onChange,
  onRemove,
}: {
  rule: FilterRule;
  fields: FilterField[];
  onChange: (fn: Updater<FilterRule>) => void;
  onRemove: () => void;
}) {
  const t = useNexubMessages();
  // The text shows what was typed right away; `rule` may be a deferred render behind it.
  const [draft, setDraft] = React.useState(rule.value);
  const [seen, setSeen] = React.useState(rule.value);
  if (rule.value !== seen) {
    setSeen(rule.value);
    setDraft(rule.value);
  }
  const field = fields.find((f) => f.id === rule.field) ?? fields[0];
  const ops = filterOperators[field?.type ?? 'text'];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select.Root
        value={field?.id}
        onValueChange={(id) => {
          const f = fields.find((x) => x.id === id);
          const nextOps = filterOperators[f?.type ?? 'text'];
          // A new field type resets the operator (if unsupported) and the value.
          onChange((r) => ({ ...r, field: id, operator: nextOps.includes(r.operator) ? r.operator : nextOps[0]!, value: '' }));
        }}
      >
        <Select.Trigger aria-label={t.filterField} className="w-auto min-w-36">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {fields.map((f) => (
            <Select.Item key={f.id} value={f.id}>
              {f.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Select.Root value={rule.operator} onValueChange={(op) => onChange((r) => ({ ...r, operator: op as FilterOperator }))}>
        <Select.Trigger aria-label={t.filterOperator} className="w-auto min-w-32">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {ops.map((op) => (
            <Select.Item key={op} value={op}>
              {t.filterOperators[op]}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {rule.operator !== 'isEmpty' &&
        (field?.type === 'select' ? (
          <Select.Root value={rule.value || undefined} onValueChange={(v) => onChange((r) => ({ ...r, value: v }))}>
            <Select.Trigger aria-label={t.filterValue} className="w-auto min-w-36">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {field.options?.map((o) => (
                <Select.Item key={o.value} value={o.value}>
                  {o.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        ) : (
          <Input
            aria-label={t.filterValue}
            type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
            value={draft}
            onChange={(e) => {
              const v = e.target.value;
              setDraft(v);
              onChange((r) => ({ ...r, value: v }));
            }}
            wrapperClassName="w-auto min-w-36 flex-1"
          />
        ))}

      <IconButton label={t.removeFilter} variant="ghost" size="sm" onClick={onRemove}>
        <X size="sm" aria-hidden="true" />
      </IconButton>
    </div>
  );
}
