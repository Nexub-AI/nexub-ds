import * as React from 'react';
import { ActivityIndicator, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ControlSize } from '@nexub/core';
import { ChevronsUpDown } from '@nexub/icons/native';
import { useAsyncSearch, type AsyncSearch } from '../hooks/useAsyncSearch';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './actions';
import { ListItem, ListSection } from './containers';
import { SearchField } from './inputs';
import { BottomSheet } from './overlays';
import { controlHeight } from './shared';

// ─── Shared search rows (ComboboxField, MultiSelect) ────────────────────────

/** The loading, error and empty rows under a searchable sheet list. */
export function SearchStatus({
  loading,
  failed,
  empty,
  emptyText,
  onRetry,
}: {
  loading: boolean;
  failed: boolean;
  empty: boolean;
  emptyText?: string;
  onRetry: () => void;
}) {
  const { roles, tokens, messages } = useTheme();
  const row = { alignItems: 'center', justifyContent: 'center', gap: tokens.spacing[2], paddingVertical: tokens.spacing[6] } as const;
  if (loading)
    return (
      <View style={[row, { flexDirection: 'row' }]} accessible accessibilityLabel={messages.loading} accessibilityLiveRegion="polite" accessibilityState={{ busy: true }}>
        <ActivityIndicator size="small" color={roles['on-surface-variant']} />
        <Text variant="body-md" color="on-surface-muted">
          {messages.loading}
        </Text>
      </View>
    );
  if (failed)
    return (
      <View style={row}>
        <Text variant="body-md" color="error" accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ textAlign: 'center' }}>
          {messages.searchFailed}
        </Text>
        <Button variant="text" size="sm" onPress={onRetry}>
          {messages.retry}
        </Button>
      </View>
    );
  if (empty)
    return (
      <Text variant="body-md" color="on-surface-muted" accessibilityLiveRegion="polite" style={{ textAlign: 'center', paddingVertical: tokens.spacing[6] }}>
        {emptyText ?? messages.noResults}
      </Text>
    );
  return null;
}

/** Field sizes on native: the mobile heights. */
export type FieldSize = Extract<ControlSize, 'md' | 'lg' | 'xl'>;

/** The field-styled button that opens a sheet (Select, ComboboxField, MultiSelect). */
export function SheetFieldButton({
  accessibilityLabel,
  accessibilityHint,
  disabled,
  readOnly,
  invalid,
  expanded,
  size = 'lg',
  onPress,
  children,
}: {
  accessibilityLabel: string;
  accessibilityHint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  expanded: boolean;
  size?: FieldSize;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, expanded: readOnly ? undefined : expanded }}
      disabled={disabled}
      onPress={readOnly ? undefined : onPress}
      pressScale={false}
      style={{
        minHeight: controlHeight(theme, size),
        paddingHorizontal: tokens.spacing['3-5'],
        paddingVertical: tokens.spacing[1],
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.spacing[2],
        borderRadius: tokens.shape.field,
        borderWidth: invalid ? 2 : 1,
        borderColor: invalid ? roles.error : readOnly ? roles['outline-variant'] : roles.outline,
        backgroundColor: readOnly ? roles['surface-container-low'] : roles['surface-container-lowest'],
        opacity: disabled ? tokens.state['disabled-content'] : 1,
      }}
    >
      {children}
      {!readOnly && <ChevronsUpDown size="sm" color={roles['on-surface-variant']} />}
    </Pressable>
  );
}

// ─── ComboboxField ───────────────────────────────────────────────────────────

/** One choice in a ComboboxField (the same shape as on web). */
export interface ComboboxOption {
  value: string;
  label: string;
  /** A second line under the label (an email, a code, a role). Also searched. */
  description?: string;
  /** More text the option is found by (a job title, a former name, an ISO code). */
  keywords?: string[];
  /** Listed but can't be picked. */
  disabled?: boolean;
  /** A heading the option is listed under. Groups appear in the order of their first option. */
  group?: string;
}

export interface ComboboxFieldProps {
  /** Visible label above the field; also the sheet's title and part of the field's accessible name. */
  label: string;
  /** The choices. With an async `onSearch`, these show until the first search answers. */
  options: readonly ComboboxOption[];
  /** The picked option's value; `null` (or `undefined` when uncontrolled) for none. */
  value?: string | null;
  /** The value to start with when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the picked value, or `null` when the "none" option is picked. */
  onValueChange?: (value: string | null) => void;
  /** Shown in the field when nothing is picked. @default 'Select…' */
  placeholder?: string;
  /** The search box's placeholder. @default 'Search…' */
  searchPlaceholder?: string;
  /** Shown when the search finds nothing. @default 'No results found.' */
  emptyText?: string;
  /** A first option that clears the value (`null`), labelled with this text, e.g. "No manager". */
  noneOption?: string;
  /**
   * Async search, called with the typed text after `searchDebounce`. Return a promise of options
   * and the sheet shows them, with a loading row while it runs and a retry row if it rejects; an
   * answer that arrives after a newer search started is ignored. Return nothing to set `options`
   * and `loading` yourself, as on web. Either way the list is not filtered here.
   */
  onSearch?: AsyncSearch<ComboboxOption>;
  /** Milliseconds to wait after the last keystroke before `onSearch` runs. @default 300 */
  searchDebounce?: number;
  /** The options are loading (when you run the search yourself). Shows the loading row. */
  loading?: boolean;
  /** The picked option when it may not be in `options` (async search: its label before any search has run). */
  selectedOption?: ComboboxOption;
  /** Hint under the field. Replaced by `error` when set. */
  helperText?: string;
  /** The web name for `helperText`: help under the field. */
  description?: string;
  /** Error under the field: red outline, and read out with the field. */
  error?: string;
  /** Marks the field invalid without a message (red outline). */
  invalid?: boolean;
  /** Adds "required" to the field's accessible hint. */
  required?: boolean;
  disabled?: boolean;
  /** Shows the value; the sheet can't open. Stays focusable for screen readers. */
  readOnly?: boolean;
  /** @default 'lg' (48, the mobile field height) */
  size?: FieldSize;
  style?: StyleProp<ViewStyle>;
}

/** Options under their group headings, in the order each group first appears. */
function groupOptions(options: readonly ComboboxOption[]) {
  const groups: { heading?: string; options: ComboboxOption[] }[] = [];
  const byHeading = new Map<string | undefined, { heading?: string; options: ComboboxOption[] }>();
  for (const option of options) {
    let group = byHeading.get(option.group);
    if (!group) {
      group = { heading: option.group, options: [] };
      byHeading.set(option.group, group);
      groups.push(group);
    }
    group.options.push(option);
  }
  return groups;
}

const matches = (o: ComboboxOption, q: string) =>
  [o.label, o.description, ...(o.keywords ?? [])].some((t) => t?.toLowerCase().includes(q));

/**
 * A searchable single choice (web ComboboxField on mobile): a field-styled button that opens a
 * bottom sheet with a search box and a list. Use it for lists longer than about ten options;
 * Select stays for short ones. Supports async search with debounce, loading and error rows.
 */
export function ComboboxField({
  label,
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  noneOption,
  onSearch,
  searchDebounce = 300,
  loading: loadingProp,
  selectedOption,
  helperText,
  description,
  error,
  invalid,
  required,
  disabled,
  readOnly,
  size,
  style,
}: ComboboxFieldProps) {
  const { tokens, messages } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [v = null, setV] = useControllableState<string | null>({ value, defaultValue, onChange: onValueChange });
  const search = useAsyncSearch(onSearch, searchDebounce);

  // Labels for the picked value even when it drops out of `options` (async search).
  const [known, setKnown] = React.useState<ReadonlyMap<string, ComboboxOption>>(() => new Map());
  const seen = [...options, ...(search.results ?? [])];
  if (seen.some((o) => known.get(o.value) !== o)) setKnown(new Map([...known, ...seen.map((o) => [o.value, o] as const)]));
  const picked = v == null ? undefined : (options.find((o) => o.value === v) ?? (selectedOption?.value === v ? selectedOption : known.get(v)));

  const q = query.trim().toLowerCase();
  const source = search.results ?? options;
  const shown = onSearch || !q ? source : source.filter((o) => matches(o, q));
  const loading = !!loadingProp || search.loading;
  const help = error ?? helperText ?? description;
  const shownText = picked?.label ?? (v == null && noneOption ? noneOption : (placeholder ?? messages.selectPlaceholder));

  const openSheet = () => {
    setOpen(true);
    search.search(query, true);
  };
  const close = () => {
    setOpen(false);
    if (query) setQuery('');
    search.reset();
  };
  const choose = (next: string | null) => {
    setV(next);
    close();
  };

  return (
    <View style={[{ gap: tokens.spacing['1-5'] }, style]}>
      <Text variant="label-lg" color={error ? 'error' : 'on-surface-variant'} importantForAccessibility="no">
        {label}
      </Text>
      <SheetFieldButton
        accessibilityLabel={`${label}, ${shownText}`}
        accessibilityHint={[help, required ? messages.fieldRequired : undefined].filter(Boolean).join('. ') || undefined}
        disabled={disabled}
        readOnly={readOnly}
        invalid={!!error || invalid}
        expanded={open}
        size={size}
        onPress={openSheet}
      >
        <Text variant="body-lg" color={picked ? 'on-surface' : 'on-surface-muted'} style={{ flex: 1 }} numberOfLines={1}>
          {shownText}
        </Text>
      </SheetFieldButton>
      {help && (
        <Text variant="body-sm" color={error ? 'error' : 'on-surface-variant'} accessibilityLiveRegion={error ? 'polite' : undefined}>
          {help}
        </Text>
      )}
      <BottomSheet open={open && !readOnly} onOpenChange={(o) => (o ? setOpen(true) : close())} title={label} detents={[0.6, 0.92]} scroll>
        <SearchField
          value={query}
          placeholder={searchPlaceholder ?? messages.searchPlaceholder}
          onChangeText={(t) => {
            setQuery(t);
            search.search(t);
          }}
          style={{ marginBottom: tokens.spacing[2] }}
        />
        {!loading && !search.failed && (
          <View accessibilityRole="list" accessibilityLabel={label}>
            {noneOption && !q && (
              <ListSection>
                <ListItem variant="radio" title={noneOption} checked={v === null} onCheckedChange={() => choose(null)} />
              </ListSection>
            )}
            {groupOptions(shown).map((g, i) => (
              <ListSection key={g.heading ?? `ungrouped-${i}`} header={g.heading}>
                {g.options.map((o) => (
                  <ListItem
                    key={o.value}
                    variant="radio"
                    title={o.label}
                    subtitle={o.description}
                    disabled={o.disabled}
                    checked={o.value === v}
                    onCheckedChange={() => choose(o.value)}
                  />
                ))}
              </ListSection>
            ))}
          </View>
        )}
        <SearchStatus
          loading={loading}
          failed={search.failed}
          empty={shown.length === 0}
          emptyText={emptyText}
          onRetry={() => search.search(query, true)}
        />
      </BottomSheet>
    </View>
  );
}
