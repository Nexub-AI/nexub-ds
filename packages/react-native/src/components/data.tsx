import * as React from 'react';
import { FlatList, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  filterOperators,
  newFilterRule,
  type FilterField,
  type FilterGroup,
  type FilterOperator,
  type FilterRule,
  isFilterGroup,
} from '@nexub/core';
import { ArrowDown, ArrowUp, ChevronsUpDown, X } from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { Button, IconButton } from './actions';
import { ListItem, ListSection } from './containers';
import { Progress } from './feedback';
import { SearchField, SegmentedControl, TextField } from './inputs';
import { BottomSheet, Select } from './overlays';

// ─── MultiSelect ─────────────────────────────────────────────────────────────

export interface MultiSelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export interface MultiSelectProps<T extends string> {
  label: string;
  options: readonly MultiSelectOption<T>[];
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (value: T[]) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  /** A search field above the options. @default more than 8 options */
  searchable?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Pick several options in a sheet (web MultiSelect on mobile). The sheet stays open while toggling. */
export function MultiSelect<T extends string>({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  helperText,
  error,
  disabled,
  searchable,
  style,
}: MultiSelectProps<T>) {
  const { roles, tokens, messages } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [v = [], setV] = useControllableState<T[]>({ value, defaultValue: defaultValue ?? [], onChange: onValueChange });
  const labels = v.map((x) => options.find((o) => o.value === x)?.label ?? x);
  // "Bug, Design" or "Bug, Design, +3 more": the field stays one line.
  const summary = labels.length > 2 ? `${labels.slice(0, 2).join(', ')}, +${messages.moreCount(labels.length - 2)}` : labels.join(', ');
  const search = searchable ?? options.length > 8;
  const q = query.trim().toLowerCase();
  const shown = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;

  return (
    <View style={[{ gap: tokens.spacing['1-5'] }, style]}>
      <Text variant="label-lg" color={error ? 'error' : 'on-surface-variant'} importantForAccessibility="no">
        {label}
      </Text>
      <Pressable
        accessibilityLabel={`${label}, ${summary || placeholder || ''}`}
        accessibilityHint={error ?? helperText}
        disabled={disabled}
        onPress={() => setOpen(true)}
        pressScale={false}
        style={{
          minHeight: tokens.size.control.lg,
          paddingHorizontal: tokens.spacing['3-5'],
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: tokens.shape.field,
          borderWidth: error ? 2 : 1,
          borderColor: error ? roles.error : roles.outline,
          backgroundColor: roles['surface-container-lowest'],
          opacity: disabled ? tokens.state['disabled-content'] : 1,
        }}
      >
        <Text variant="body-lg" color={summary ? 'on-surface' : 'on-surface-muted'} style={{ flex: 1 }} numberOfLines={1}>
          {summary || placeholder || ''}
        </Text>
        <ChevronsUpDown size="sm" color={roles['on-surface-variant']} />
      </Pressable>
      {(error || helperText) && (
        <Text variant="body-sm" color={error ? 'error' : 'on-surface-variant'}>
          {error ?? helperText}
        </Text>
      )}
      <BottomSheet
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQuery('');
        }}
        title={label}
        detents={options.length > 6 ? [0.6, 0.92] : ['content']}
        scroll={options.length > 6}
      >
        {search && <SearchField value={query} onChangeText={setQuery} style={{ marginBottom: tokens.spacing[2] }} />}
        <ListSection>
          {shown.map((o) => (
            <ListItem
              key={o.value}
              variant="checkbox"
              title={o.label}
              subtitle={o.description}
              checked={v.includes(o.value)}
              onCheckedChange={(on) => setV(on ? [...v, o.value] : v.filter((x) => x !== o.value))}
            />
          ))}
        </ListSection>
        {shown.length === 0 && (
          <Text variant="body-md" color="on-surface-muted" style={{ textAlign: 'center', paddingVertical: tokens.spacing[6] }}>
            {messages.noResults}
          </Text>
        )}
      </BottomSheet>
    </View>
  );
}

// ─── DataList ────────────────────────────────────────────────────────────────

export interface DataListSort<T> {
  id: string;
  label: string;
  compare: (a: T, b: T) => number;
}

export interface DataListProps<T> {
  data: readonly T[];
  keyExtractor: (item: T) => string;
  title: (item: T) => string;
  subtitle?: (item: T) => string | undefined;
  /** Trailing key value, e.g. an amount or status. */
  value?: (item: T) => string | undefined;
  leading?: (item: T) => React.ReactNode;
  onPressItem?: (item: T) => void;
  /** Sort choices; a Sort button opens them in a sheet. */
  sorts?: DataListSort<T>[];
  sort?: { id: string; desc: boolean };
  defaultSort?: { id: string; desc: boolean };
  onSortChange?: (sort: { id: string; desc: boolean }) => void;
  /** Checkbox rows; the selection bar shows `bulkActions` while rows are selected. */
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  bulkActions?: (keys: string[], clear: () => void) => React.ReactNode;
  /** Shown when `data` is empty. */
  empty?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * The mobile form of a data table: one row per record with its key fields,
 * a sort sheet and a selection mode. A FlatList, so long lists stay fast.
 */
export function DataList<T>({
  data,
  keyExtractor,
  title,
  subtitle,
  value,
  leading,
  onPressItem,
  sorts,
  sort: sortProp,
  defaultSort,
  onSortChange,
  selectable,
  selected: selectedProp,
  onSelectedChange,
  bulkActions,
  empty,
  style,
}: DataListProps<T>) {
  const { roles, tokens, messages } = useTheme();
  const [sortOpen, setSortOpen] = React.useState(false);
  const [sort, setSort] = useControllableState<{ id: string; desc: boolean } | undefined>({
    value: sortProp,
    defaultValue: defaultSort,
    onChange: (s) => s && onSortChange?.(s),
  });
  const [selected = [], setSelected] = useControllableState<string[]>({
    value: selectedProp,
    defaultValue: [],
    onChange: onSelectedChange,
  });
  const active = sorts?.find((s) => s.id === sort?.id);
  const rows = React.useMemo(() => {
    if (!active) return data;
    const out = [...data].sort(active.compare);
    return sort?.desc ? out.reverse() : out;
  }, [data, active, sort?.desc]);
  const clear = () => setSelected([]);

  return (
    <View style={[{ flex: 1 }, style]}>
      {(sorts?.length || (selectable && selected.length > 0)) && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[2], paddingVertical: tokens.spacing[2], minHeight: tokens.size.control.lg }}>
          {selectable && selected.length > 0 ? (
            <>
              <Text variant="label-lg" accessibilityLiveRegion="polite" style={{ flex: 1 }}>
                {messages.selectedCount(String(selected.length))}
              </Text>
              {bulkActions?.(selected, clear)}
              <IconButton icon={X} label={messages.clearSelection} onPress={clear} />
            </>
          ) : (
            <>
              <View style={{ flex: 1 }} />
              <Button
                variant="text"
                size="sm"
                trailingIcon={sort?.desc ? ArrowDown : ArrowUp}
                onPress={() => setSortOpen(true)}
                accessibilityLabel={active ? `${messages.sortBy}: ${active.label}` : messages.sortBy}
              >
                {active?.label ?? messages.sortBy}
              </Button>
            </>
          )}
        </View>
      )}
      <FlatList
        data={rows}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: roles['outline-variant'] }} />}
        ListEmptyComponent={empty ? () => <>{empty}</> : undefined}
        renderItem={({ item }) => {
          const key = keyExtractor(item);
          return selectable ? (
            <ListItem
              variant="checkbox"
              title={title(item)}
              subtitle={[subtitle?.(item), value?.(item)].filter(Boolean).join(' · ') || undefined}
              leading={leading?.(item)}
              checked={selected.includes(key)}
              onCheckedChange={(on) => setSelected(on ? [...selected, key] : selected.filter((k) => k !== key))}
            />
          ) : (
            <ListItem
              title={title(item)}
              subtitle={subtitle?.(item)}
              value={value?.(item)}
              leading={leading?.(item)}
              onPress={onPressItem ? () => onPressItem(item) : undefined}
            />
          );
        }}
      />
      {sorts && (
        <BottomSheet open={sortOpen} onOpenChange={setSortOpen} title={messages.sortBy}>
          <ListSection>
            {sorts.map((s) => (
              <ListItem
                key={s.id}
                variant="radio"
                title={s.label}
                checked={s.id === sort?.id}
                onCheckedChange={() => setSort({ id: s.id, desc: s.id === sort?.id ? !!sort?.desc : false })}
              />
            ))}
          </ListSection>
          <SegmentedControl
            label={messages.sortDirection}
            options={[
              { value: 'asc', label: messages.ascending },
              { value: 'desc', label: messages.descending },
            ]}
            value={sort?.desc ? 'desc' : 'asc'}
            onValueChange={(d) => sort && setSort({ ...sort, desc: d === 'desc' })}
            style={{ marginTop: tokens.spacing[3] }}
          />
        </BottomSheet>
      )}
    </View>
  );
}

// ─── FileList ────────────────────────────────────────────────────────────────

export interface FileListItem {
  id: string;
  name: string;
  /** Bytes. */
  size?: number;
  /** 0–100 while uploading. */
  progress?: number;
  error?: string;
}

export interface FileListProps {
  files: FileListItem[];
  /** Opens your picker (expo-document-picker, image picker…); add what it returns to `files`. */
  onAdd?: () => void;
  onRemove?: (id: string) => void;
  /** Stops an upload in progress. */
  onCancel?: (id: string) => void;
  addLabel?: string;
  style?: StyleProp<ViewStyle>;
}

const formatSize = (bytes: number, locale: string) => {
  const [v, unit] =
    bytes < 1024 ? [bytes, 'byte'] : bytes < 1024 * 1024 ? [bytes / 1024, 'kilobyte'] : [bytes / (1024 * 1024), 'megabyte'];
  return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short', maximumFractionDigits: 1 }).format(v);
};

/** Files picked for upload, with progress, errors and remove/cancel. Bring your own picker. */
export function FileList({ files, onAdd, onRemove, onCancel, addLabel, style }: FileListProps) {
  const { messages, locale } = useTheme();
  return (
    <View style={[{ gap: 12 }, style]}>
      {files.map((f) => {
        const uploading = f.progress !== undefined && f.progress < 100;
        const percent = Math.round(Math.max(0, Math.min(100, f.progress ?? 0)));
        return (
          <View key={f.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="label-lg" numberOfLines={1}>
                {f.name}
              </Text>
              <Text variant="body-sm" color="on-surface-muted">
                {[f.size !== undefined ? formatSize(f.size, locale) : null, uploading ? `${percent}%` : null].filter(Boolean).join(' · ')}
              </Text>
              {uploading && <Progress value={percent / 100} label={messages.uploadProgress(f.name, percent)} />}
              {f.error && (
                <Text variant="body-sm" color="error" accessibilityLiveRegion="polite">
                  {f.error}
                </Text>
              )}
            </View>
            {uploading && onCancel ? (
              <IconButton icon={X} label={messages.cancelUpload(f.name)} onPress={() => onCancel(f.id)} />
            ) : onRemove ? (
              <IconButton icon={X} label={messages.removeFile(f.name)} onPress={() => onRemove(f.id)} />
            ) : null}
          </View>
        );
      })}
      {onAdd && (
        <Button variant="outlined" onPress={onAdd}>
          {addLabel ?? messages.uploadFiles}
        </Button>
      )}
    </View>
  );
}

// ─── FilterSheet ─────────────────────────────────────────────────────────────

export interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FilterField[];
  /** The same JSON as the web FilterBuilder. Mobile edits one flat AND/OR list; nested groups are kept as they are. */
  value: FilterGroup;
  onValueChange: (value: FilterGroup) => void;
  title?: string;
}

/** The web FilterBuilder on mobile: rules in a sheet, one per card. */
export function FilterSheet({ open, onOpenChange, fields, value, onValueChange, title }: FilterSheetProps) {
  const { messages, roles, tokens } = useTheme();
  const setRules = (rules: FilterGroup['rules']) => onValueChange({ ...value, rules });
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title={title} detents={[0.7, 0.95]} scroll>
      <View style={{ gap: tokens.spacing[3] }}>
        <SegmentedControl
          label={messages.filterGroup(value.combinator)}
          options={[
            { value: 'and', label: messages.matchAll },
            { value: 'or', label: messages.matchAny },
          ]}
          value={value.combinator}
          onValueChange={(c) => onValueChange({ ...value, combinator: c })}
        />
        {value.rules.map((r, i) => {
          if (isFilterGroup(r)) return null;
          const replace = (next: FilterRule) => setRules(value.rules.map((x, j) => (j === i ? next : x)));
          const field = fields.find((f) => f.id === r.field) ?? fields[0];
          const ops = filterOperators[field?.type ?? 'text'];
          return (
            <View
              key={r.id}
              style={{
                gap: tokens.spacing[2],
                padding: tokens.spacing[3],
                borderRadius: tokens.shape.container,
                borderWidth: 1,
                borderColor: roles['outline-variant'],
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Select
                    label={messages.filterField}
                    options={fields.map((f) => ({ value: f.id, label: f.label }))}
                    value={field?.id}
                    onValueChange={(id) => {
                      const nextOps = filterOperators[fields.find((f) => f.id === id)?.type ?? 'text'];
                      replace({ ...r, field: id, operator: nextOps.includes(r.operator) ? r.operator : nextOps[0]!, value: '' });
                    }}
                  />
                </View>
                <IconButton
                  icon={X}
                  label={messages.removeFilter}
                 
                  onPress={() => setRules(value.rules.filter((_, j) => j !== i))}
                />
              </View>
              <Select
                label={messages.filterOperator}
                options={ops.map((op) => ({ value: op, label: messages.filterOperators[op] }))}
                value={r.operator}
                onValueChange={(op) => replace({ ...r, operator: op as FilterOperator })}
              />
              {r.operator !== 'isEmpty' &&
                (field?.type === 'select' ? (
                  <Select
                    label={messages.filterValue}
                    options={(field.options ?? []).map((o) => ({ value: o.value, label: o.label }))}
                    value={r.value || undefined}
                    onValueChange={(v) => replace({ ...r, value: v })}
                  />
                ) : (
                  <TextField
                    label={messages.filterValue}
                    value={r.value}
                    onChangeText={(t) => replace({ ...r, value: t })}
                    keyboardType={field?.type === 'number' ? 'decimal-pad' : 'default'}
                    placeholder={field?.type === 'date' ? 'YYYY-MM-DD' : undefined}
                  />
                ))}
            </View>
          );
        })}
        <Button variant="tonal" onPress={() => setRules([...value.rules, newFilterRule(fields[0])])} disabled={!fields.length}>
          {messages.addFilter}
        </Button>
      </View>
    </BottomSheet>
  );
}
