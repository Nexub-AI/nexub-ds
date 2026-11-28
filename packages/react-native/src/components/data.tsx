import * as React from 'react';
import { AccessibilityInfo, FlatList, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  filterOperators,
  newFilterRule,
  type FilterField,
  type FilterGroup,
  type FilterOperator,
  type FilterRule,
  isFilterGroup,
} from '@nexub/core';
import { ArrowDown, ArrowUp, Plus, X } from '@nexub/icons/native';
import { useAsyncSearch } from '../hooks/useAsyncSearch';
import { useControllableState } from '../hooks/useControllableState';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { nxEnter } from '../theme/motion';
import { Button, IconButton } from './actions';
import { SearchStatus, SheetFieldButton, type FieldSize } from './combobox';
import { ListItem, ListSection } from './containers';
import { Progress, Skeleton } from './feedback';
import { SearchField, SegmentedControl, TextField } from './inputs';
import { BottomSheet, Select } from './overlays';

// ─── MultiSelect ─────────────────────────────────────────────────────────────

export interface MultiSelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  /** 11.2: listed but can't be picked. */
  disabled?: boolean;
  /** 11.2: shown before the label, e.g. an `Avatar` for people. */
  avatar?: React.ReactNode;
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
  /** A search field above the options. @default more than 8 options, or always with `onSearch`, `onInputChange` or `onCreate` */
  searchable?: boolean;
  /** Shown when the search finds nothing. @default 'No results found.' */
  emptyText?: string;
  /** The options are loading (when you run the search yourself): shows a loading row instead of the list. */
  loading?: boolean;
  /** Controlled search text. */
  inputValue?: string;
  /** Called as the user types; options are then shown as given (no built-in filtering). */
  onInputChange?: (text: string) => void;
  /**
   * Async search, called with the typed text after `searchDebounce`. Return a promise of options
   * and the sheet shows them, with a loading row and a retry row if it rejects; an answer that
   * arrives after a newer search started is ignored. Return nothing to set `options` and
   * `loading` yourself, as on web. Picked values keep their labels when they drop out of the list.
   */
  onSearch?: (text: string) => Promise<readonly MultiSelectOption<T>[]> | void;
  /** Milliseconds to wait after the last keystroke before `onSearch` runs. @default 300 */
  searchDebounce?: number;
  /** Adds a "Create “text”" row when the search text matches no option exactly; called with the trimmed text. */
  onCreate?: (text: string) => void;
  /** Chips shown in the field before the rest collapse into a "+N more" chip. @default 2 */
  maxVisibleChips?: number;
  /** Shows the chips but nothing can be added or removed; the sheet doesn't open. */
  readOnly?: boolean;
  /** @default 'lg' (48, the mobile field height) */
  size?: FieldSize;
  style?: StyleProp<ViewStyle>;
}

/** A picked value in the field: a small capsule, read out as part of the field. */
function Token({ label, leading }: { label: string; leading?: React.ReactNode }) {
  const { roles, tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.spacing[1],
        paddingHorizontal: tokens.spacing[2],
        paddingVertical: tokens.spacing['0-5'],
        borderRadius: tokens.shape.control,
        backgroundColor: roles['secondary-container'],
        maxWidth: '100%',
      }}
    >
      {leading}
      <Text variant="label-md" color="on-secondary-container" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
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
  emptyText,
  loading: loadingProp,
  inputValue,
  onInputChange,
  onSearch,
  searchDebounce = 300,
  onCreate,
  maxVisibleChips = 2,
  readOnly,
  size,
  style,
}: MultiSelectProps<T>) {
  const { roles, tokens, messages } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [innerQuery, setInnerQuery] = React.useState('');
  const query = inputValue ?? innerQuery;
  const asyncSearch = useAsyncSearch(onSearch, searchDebounce);
  const setQuery = (text: string) => {
    setInnerQuery(text);
    onInputChange?.(text);
    asyncSearch.search(text);
  };
  const [v = [], setV] = useControllableState<T[]>({ value, defaultValue: defaultValue ?? [], onChange: onValueChange });

  // Labels and avatars for picked values, even ones no longer in the list (async search).
  const [known, setKnown] = React.useState<ReadonlyMap<string, MultiSelectOption<T>>>(() => new Map());
  const seen = [...options, ...(asyncSearch.results ?? [])];
  if (seen.some((o) => known.get(o.value) !== o)) setKnown(new Map([...known, ...seen.map((o) => [o.value, o] as const)]));
  const optionOf = (x: T) => options.find((o) => o.value === x) ?? known.get(x);
  const labels = v.map((x) => optionOf(x)?.label ?? x);
  const visible = Math.max(0, maxVisibleChips);
  const hidden = Math.max(0, v.length - visible);
  // "Bug, Design" or "Bug, Design, +3 more": the same text the chips show.
  const summary = [...labels.slice(0, visible), ...(hidden ? [`+${messages.moreCount(hidden)}`] : [])].join(', ');

  const remote = !!onSearch || !!onInputChange;
  const search = searchable ?? (remote || !!onCreate || options.length > 8);
  const text = query.trim();
  const q = text.toLowerCase();
  const source = asyncSearch.results ?? options;
  const shown = remote || !q ? source : source.filter((o) => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q));
  const loading = !!loadingProp || asyncSearch.loading;
  const canCreate = !!onCreate && !loading && text !== '' && !source.some((o) => o.label.toLowerCase() === q);
  const tall = search || options.length > 6;

  return (
    <View style={[{ gap: tokens.spacing['1-5'] }, style]}>
      <Text variant="label-lg" color={error ? 'error' : 'on-surface-variant'} importantForAccessibility="no">
        {label}
      </Text>
      <SheetFieldButton
        accessibilityLabel={`${label}, ${summary || placeholder || ''}`}
        accessibilityHint={error ?? helperText}
        disabled={disabled}
        readOnly={readOnly}
        invalid={!!error}
        expanded={open}
        size={size}
        onPress={() => {
          setOpen(true);
          asyncSearch.search(query, true);
        }}
      >
        {v.length ? (
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[1] }}>
            {v.slice(0, visible).map((x, i) => (
              <Token key={x} label={labels[i]!} leading={optionOf(x)?.avatar} />
            ))}
            {hidden > 0 && <Token label={`+${messages.moreCount(hidden)}`} />}
          </View>
        ) : (
          <Text variant="body-lg" color="on-surface-muted" style={{ flex: 1 }} numberOfLines={1}>
            {placeholder ?? ''}
          </Text>
        )}
      </SheetFieldButton>
      {(error || helperText) && (
        <Text variant="body-sm" color={error ? 'error' : 'on-surface-variant'}>
          {error ?? helperText}
        </Text>
      )}
      <BottomSheet
        open={open && !readOnly}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) {
            if (query) setQuery('');
            asyncSearch.reset();
          }
        }}
        title={label}
        detents={tall ? [0.6, 0.92] : ['content']}
        scroll={tall}
      >
        {search && <SearchField value={query} onChangeText={setQuery} style={{ marginBottom: tokens.spacing[2] }} />}
        {!loading && !asyncSearch.failed && (shown.length > 0 || canCreate) && (
          <View accessibilityRole="list" accessibilityLabel={label}>
            <ListSection>
              {shown.map((o) => (
                <ListItem
                  key={o.value}
                  variant="checkbox"
                  title={o.label}
                  subtitle={o.description}
                  leading={o.avatar}
                  disabled={o.disabled}
                  checked={v.includes(o.value)}
                  onCheckedChange={(on) => setV(on ? [...v, o.value] : v.filter((x) => x !== o.value))}
                />
              ))}
              {canCreate && (
                <ListItem
                  variant="button"
                  title={messages.createOption(text)}
                  leading={<Plus size="sm" color={roles.primary} />}
                  onPress={() => {
                    onCreate(text);
                    setQuery('');
                  }}
                />
              )}
            </ListSection>
          </View>
        )}
        <SearchStatus
          loading={loading}
          failed={asyncSearch.failed}
          empty={shown.length === 0 && !canCreate}
          emptyText={emptyText}
          onRetry={() => asyncSearch.search(query, true)}
        />
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
  /**
   * 12.5: rows can keep arriving (an agent is producing the data). A skeleton row trails the last
   * row (hidden from screen readers), the list is busy, the row count is announced at most every
   * 3 seconds and "Done. N rows" when `streaming` turns off. Rows that arrive meanwhile fade in
   * (instant under Reduce Motion). Before the first row, the skeleton row shows instead of `empty`.
   */
  streaming?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** 12.5: how often, at most, a streaming list announces its row count. */
const STREAM_ANNOUNCE_MS = 3000;

/**
 * 12.5 (web DataTable's twin): while `streaming`, announce the count at most every
 * STREAM_ANNOUNCE_MS, starting one interval after the stream begins; when it stops, announce "done".
 */
function useStreamingAnnouncements(streaming: boolean, count: number, say: (count: number, done: boolean) => void) {
  const latest = React.useRef({ count, say });
  const state = React.useRef<{ on: boolean; last: number; timer?: ReturnType<typeof setTimeout> }>({ on: false, last: 0 });
  React.useEffect(() => {
    latest.current = { count, say };
  });
  React.useEffect(() => {
    const s = state.current;
    if (streaming && !s.on) {
      s.on = true;
      s.last = Date.now();
    } else if (!streaming && s.on) {
      s.on = false;
      clearTimeout(s.timer);
      s.timer = undefined;
      latest.current.say(count, true);
    } else if (streaming && s.timer === undefined) {
      s.timer = setTimeout(
        () => {
          s.timer = undefined;
          s.last = Date.now();
          latest.current.say(latest.current.count, false);
        },
        Math.max(0, s.last + STREAM_ANNOUNCE_MS - Date.now()),
      );
    }
  }, [streaming, count]);
  React.useEffect(() => {
    const s = state.current;
    return () => clearTimeout(s.timer);
  }, []);
}

/** 12.5: the placeholder row that trails a streaming list. */
function StreamingRow() {
  const { tokens } = useTheme();
  return (
    <View
      testID="data-list-streaming"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ minHeight: tokens.size.control.xl, justifyContent: 'center', gap: tokens.spacing[2], paddingHorizontal: tokens.spacing[4] }}
    >
      <Skeleton shape="line" width="60%" />
      <Skeleton shape="line" width="35%" height={tokens.spacing[3]} />
    </View>
  );
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
  streaming = false,
  style,
}: DataListProps<T>) {
  const { roles, tokens, messages, locale } = useTheme();
  // 12.5 streaming: remember the rows already shown, so only arrivals fade in. A list that has
  // streamed keeps its row wrappers, so rows don't remount when the stream ends.
  const seen = React.useRef<Set<string> | null>(null);
  const streamed = React.useRef(false);
  if (!streaming) seen.current = null;
  else {
    streamed.current = true;
    seen.current ??= new Set(data.map(keyExtractor));
  }
  React.useEffect(() => {
    if (streaming) for (const item of data) seen.current?.add(keyExtractor(item));
  });
  useStreamingAnnouncements(streaming, data.length, (count, done) => {
    const n = new Intl.NumberFormat(locale).format(count);
    AccessibilityInfo.announceForAccessibility(done ? messages.rowsDone(n) : messages.rowsSoFar(n));
  });
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
        ListEmptyComponent={empty && !streaming ? () => <>{empty}</> : undefined}
        ListFooterComponent={streaming ? StreamingRow : undefined}
        accessibilityState={streaming ? { busy: true } : undefined}
        renderItem={({ item }) => {
          const key = keyExtractor(item);
          const arrived = !!seen.current && !seen.current.has(key);
          const row = selectable ? (
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
          // `entering` only plays when a row mounts, so it is safe to pass on later renders.
          return streamed.current ? <Animated.View entering={arrived ? nxEnter('fade') : undefined}>{row}</Animated.View> : row;
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
  const { messages, locale, tokens } = useTheme();
  return (
    <View style={[{ gap: tokens.spacing[3] }, style]}>
      {files.map((f) => {
        const uploading = f.progress !== undefined && f.progress < 100;
        const percent = Math.round(Math.max(0, Math.min(100, f.progress ?? 0)));
        return (
          <View key={f.id} style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[2] }}>
            <View style={{ flex: 1, gap: tokens.spacing[1] }}>
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
