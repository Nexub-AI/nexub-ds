// The filter query model shared by @nexub/react's FilterBuilder and
// @nexub/react-native's FilterSheet: plain JSON your app runs.

import type { NexubMessages } from './messages.js';

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
/** A short unique id for new rules and groups. */
export const filterId = () => `f${(++seq).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** An empty top-level group, a starting `value`. */
export const emptyFilter = (): FilterGroup => ({ id: filterId(), combinator: 'and', rules: [] });

/** A new rule on `field`, with its type's first operator. */
export const newFilterRule = (field?: FilterField): FilterRule => ({
  id: filterId(),
  field: field?.id ?? '',
  operator: filterOperators[field?.type ?? 'text'][0]!,
  value: '',
});

/** Rules with a field, operator and (unless "is empty") a value. Counts nested groups too. */
export function countFilters(group: FilterGroup): number {
  return group.rules.reduce(
    (n, r) => n + (isFilterGroup(r) ? countFilters(r) : r.operator === 'isEmpty' || r.value !== '' ? 1 : 0),
    0,
  );
}
