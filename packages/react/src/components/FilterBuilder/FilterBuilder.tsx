'use client';

import * as React from 'react';
import { Plus, X } from '@nexub/icons';
import type { NexubMessages } from '@nexub/core';
import { cn } from '../../utils/cn.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { Button } from '../Button/Button.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Input } from '../Input/Input.js';
import { Select } from '../Select/Select.js';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl.js';

export type FilterFieldType = 'text' | 'number' | 'select' | 'date';
export type FilterOperator = keyof NexubMessages['filterOperators'];

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
  /** Choices for `type: 'select'`. */
  options?: { value: string; label: string }[];
}

export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  /** Always a string (dates as YYYY-MM-DD), so the query serialises as-is. */
  value: string;
}

export interface FilterGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<FilterRule | FilterGroup>;
}

/** Operators offered for each field type, in menu order. */
export const filterOperators: Record<FilterFieldType, FilterOperator[]> = {
  text: ['contains', 'equals', 'notEquals', 'startsWith', 'isEmpty'],
  number: ['equals', 'notEquals', 'greaterThan', 'lessThan'],
  select: ['equals', 'notEquals'],
  date: ['equals', 'before', 'after'],
};

export const isFilterGroup = (r: FilterRule | FilterGroup): r is FilterGroup => 'rules' in r;

let seq = 0;
const uid = () => `f${(++seq).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** An empty top-level group, a starting `value`. */
export const emptyFilter = (): FilterGroup => ({ id: uid(), combinator: 'and', rules: [] });

/** Rules with a field, operator and (unless "is empty") a value. Counts nested groups too. */
export function countFilters(group: FilterGroup): number {
  return group.rules.reduce(
    (n, r) => n + (isFilterGroup(r) ? countFilters(r) : r.operator === 'isEmpty' || r.value !== '' ? 1 : 0),
    0,
  );
}

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
  return (
    <GroupView
      group={value}
      fields={fields}
      depth={0}
      maxDepth={maxDepth}
      onChange={setValue}
      className={className}
    />
  );
}

FilterBuilder.displayName = 'FilterBuilder';

interface GroupViewProps {
  group: FilterGroup;
  fields: FilterField[];
  depth: number;
  maxDepth: number;
  onChange: (g: FilterGroup) => void;
  onRemove?: () => void;
  className?: string;
}

function GroupView({ group, fields, depth, maxDepth, onChange, onRemove, className }: GroupViewProps) {
  const t = useNexubMessages();
  const first = fields[0];
  const setRules = (rules: FilterGroup['rules']) => onChange({ ...group, rules });
  const newRule = (): FilterRule => ({
    id: uid(),
    field: first?.id ?? '',
    operator: filterOperators[first?.type ?? 'text'][0]!,
    value: '',
  });

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
          onValueChange={(v) => v && onChange({ ...group, combinator: v as 'and' | 'or' })}
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

      {group.rules.map((r, i) => {
        const replace = (next: FilterRule | FilterGroup) => setRules(group.rules.map((x, j) => (j === i ? next : x)));
        const remove = () => setRules(group.rules.filter((_, j) => j !== i));
        return isFilterGroup(r) ? (
          <GroupView key={r.id} group={r} fields={fields} depth={depth + 1} maxDepth={maxDepth} onChange={replace} onRemove={remove} />
        ) : (
          <RuleRow key={r.id} rule={r} fields={fields} onChange={replace} onRemove={remove} />
        );
      })}

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => setRules([...group.rules, newRule()])} disabled={!first}>
          <Plus size="sm" aria-hidden="true" />
          {t.addFilter}
        </Button>
        {depth < maxDepth && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRules([...group.rules, { id: uid(), combinator: 'and', rules: [newRule()] }])}
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

function RuleRow({
  rule,
  fields,
  onChange,
  onRemove,
}: {
  rule: FilterRule;
  fields: FilterField[];
  onChange: (r: FilterRule) => void;
  onRemove: () => void;
}) {
  const t = useNexubMessages();
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
          onChange({ ...rule, field: id, operator: nextOps.includes(rule.operator) ? rule.operator : nextOps[0]!, value: '' });
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

      <Select.Root value={rule.operator} onValueChange={(op) => onChange({ ...rule, operator: op as FilterOperator })}>
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
          <Select.Root value={rule.value || undefined} onValueChange={(v) => onChange({ ...rule, value: v })}>
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
            value={rule.value}
            onChange={(e) => onChange({ ...rule, value: e.target.value })}
            wrapperClassName="w-auto min-w-36 flex-1"
          />
        ))}

      <IconButton label={t.removeFilter} variant="ghost" size="sm" onClick={onRemove}>
        <X size="sm" aria-hidden="true" />
      </IconButton>
    </div>
  );
}
