import * as React from 'react';
import { ActivityIndicator, View, type StyleProp, type ViewStyle } from 'react-native';
import { ArrowDown, ArrowUp, Check, ChevronLeft, Minus } from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { IconButton } from './actions';
import { ListItem, ListSection } from './containers';
import { Skeleton } from './feedback';
import { TextField } from './inputs';
import { MIN_TARGET, disabledOpacity } from './shared';

// ─── TreeList ────────────────────────────────────────────────────────────────

export interface TreeListNode {
  id: string;
  title: string;
  subtitle?: string;
  children?: TreeListNode[];
  /** Children exist but are not loaded yet: opening the node calls `onLoadChildren`. */
  hasChildren?: boolean;
}

export interface TreeListProps {
  nodes: TreeListNode[];
  /** Title of the top level, shown on the back row from the first level down. */
  rootTitle: string;
  /** The picked leaf (controlled). Ignored when `checkable`. */
  selected?: string | null;
  /** The leaf picked at first, when `selected` is not controlled. */
  defaultSelected?: string | null;
  /** Called with the picked leaf's id. */
  onSelectedChange?: (id: string | null) => void;
  /** Called with the picked leaf's id (the same moment as `onSelectedChange`). */
  onSelect?: (id: string) => void;
  /**
   * The open levels (controlled): ids of the nodes drilled into, from the top. On web
   * these are the expanded nodes; on a phone one branch is open at a time.
   */
  expanded?: string[];
  /** The levels open at first, when `expanded` is not controlled, e.g. to start inside a branch. */
  defaultExpanded?: string[];
  /** Called with the open levels when someone drills in or goes back. */
  onExpandedChange?: (ids: string[]) => void;
  /** Checkboxes instead of single selection. A parent is checked when all its children are, mixed when some are. */
  checkable?: boolean;
  /** Every checked id, parents included (controlled). */
  checked?: string[];
  /** The ids checked at first, when `checked` is not controlled. */
  defaultChecked?: string[];
  /** Called with every checked id, parents included, after each change. */
  onCheckedChange?: (ids: string[]) => void;
  /**
   * Loads a `hasChildren` node's children when it is opened; pass them in through `nodes`.
   * A loading row shows until the promise settles.
   */
  onLoadChildren?: (node: TreeListNode) => Promise<unknown>;
  /**
   * Called when a leaf is tapped, after it is selected (or checked). On web, Enter or a
   * double-click opens a node; on a touch screen the tap is the open.
   */
  onActivate?: (node: TreeListNode) => void;
  /** Actions at the end of each row, e.g. an IconButton. They are their own screen-reader elements. */
  renderActions?: (node: TreeListNode) => React.ReactNode;
  /** Shows skeleton rows in place of the tree and marks it busy for screen readers. */
  loading?: boolean;
  /** Shown when `nodes` is empty. Defaults to the "no data" message. */
  emptyState?: React.ReactNode;
  /** Shown in place of the tree when a load failed, e.g. an ErrorState with a retry. Wins over `loading` and empty. */
  errorState?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const hasKids = (n: TreeListNode) => Boolean(n.children?.length || (n.hasChildren && !n.children));
const descendants = (n: TreeListNode): string[] => (n.children ?? []).flatMap((c) => [c.id, ...descendants(c)]);
const isSet = (node: React.ReactNode) => node != null && node !== false;

/** The drawn box of a tree checkbox: empty, checked or mixed. */
function TreeCheck({ state }: { state: boolean | 'mixed' }) {
  const { roles, tokens } = useTheme();
  const on = state !== false;
  const size = tokens.size.icon.md;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: tokens.shape.min,
        borderWidth: on ? 0 : 2,
        borderColor: roles.outline,
        backgroundColor: on ? roles.primary : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {state === 'mixed' ? (
        <Minus size="xs" strokeWidth={3} color={roles['on-primary']} />
      ) : on ? (
        <Check size="xs" strokeWidth={3} color={roles['on-primary']} />
      ) : null}
    </View>
  );
}

/**
 * A hierarchy as drill-down lists (web TreeView on mobile): rows with children
 * open the next level, leaves are picked (or checked), and a back row returns.
 */
export function TreeList({
  nodes,
  rootTitle,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  onSelect,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  checkable = false,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  onLoadChildren,
  onActivate,
  renderActions,
  loading: rootLoading = false,
  emptyState,
  errorState,
  style,
}: TreeListProps) {
  const { roles, tokens, messages } = useTheme();
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
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const checkedSet = React.useMemo(() => new Set(checked), [checked]);

  // Every loaded node's parent, for the tri-state roll-up.
  const parents = React.useMemo(() => {
    const map = new Map<string, TreeListNode | null>();
    const walk = (list: TreeListNode[], parent: TreeListNode | null) => {
      for (const n of list) {
        map.set(n.id, parent);
        if (n.children) walk(n.children, n);
      }
    };
    walk(nodes, null);
    return map;
  }, [nodes]);

  // The open branch, from the top: at each level, the node in `expanded` that has children.
  const path = React.useMemo(() => {
    const open = new Set(expanded);
    const out: TreeListNode[] = [];
    let list = nodes;
    for (let n = list.find((x) => open.has(x.id) && hasKids(x)); n; n = list.find((x) => open.has(x.id) && hasKids(x))) {
      out.push(n);
      list = n.children ?? [];
    }
    return out;
  }, [nodes, expanded]);

  const here = path.at(-1);
  const list = here ? (here.children ?? []) : nodes;
  const parentTitle = path.length > 1 ? path.at(-2)!.title : rootTitle;

  const drillIn = async (n: TreeListNode) => {
    setExpanded([...path.map((p) => p.id), n.id]);
    if (!n.hasChildren || n.children || !onLoadChildren) return;
    setLoadingId(n.id);
    try {
      await onLoadChildren(n);
    } catch {
      // The caller shows its own failure (e.g. errorState); the level stays open and empty.
    } finally {
      setLoadingId((id) => (id === n.id ? null : id));
    }
  };

  const toggleCheck = (n: TreeListNode) => {
    const next = new Set(checkedSet);
    const on = !next.has(n.id);
    for (const id of [n.id, ...descendants(n)]) {
      if (on) next.add(id);
      else next.delete(id);
    }
    // A parent is checked exactly when all its children are.
    for (let p = parents.get(n.id); p; p = parents.get(p.id) ?? null) {
      if ((p.children ?? []).every((k) => next.has(k.id))) next.add(p.id);
      else next.delete(p.id);
    }
    setChecked([...next]);
  };

  const pick = (n: TreeListNode) => {
    if (checkable) toggleCheck(n);
    else {
      setSelected(n.id);
      onSelect?.(n.id);
    }
    onActivate?.(n);
  };

  const checkState = (n: TreeListNode): boolean | 'mixed' =>
    checkedSet.has(n.id) ? true : descendants(n).some((id) => checkedSet.has(id)) ? 'mixed' : false;

  const withActions = (n: TreeListNode, row: React.ReactElement) => {
    const actions = renderActions?.(n);
    if (!isSet(actions)) return row;
    return (
      <View key={n.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>{row}</View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingEnd: tokens.spacing[2] }}>{actions}</View>
      </View>
    );
  };

  const rowFor = (n: TreeListNode) => {
    if (hasKids(n)) {
      const nav = (
        <ListItem
          key={n.id}
          variant="navigation"
          title={n.title}
          subtitle={n.subtitle}
          value={n.children?.length ? String(n.children.length) : undefined}
          onPress={() => void drillIn(n)}
          style={checkable ? { paddingStart: tokens.spacing[3] } : undefined}
        />
      );
      if (!checkable) return withActions(n, nav);
      const state = checkState(n);
      // The box and the row are two targets: the box checks the whole branch, the row opens it.
      return withActions(
        n,
        <View key={n.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel={n.title}
            accessibilityState={{ checked: state }}
            haptic="selection"
            onPress={() => toggleCheck(n)}
            pressScale={false}
            style={{ minHeight: MIN_TARGET, minWidth: MIN_TARGET, paddingStart: tokens.spacing[4], justifyContent: 'center' }}
          >
            <TreeCheck state={state} />
          </Pressable>
          <View style={{ flex: 1 }}>{nav}</View>
        </View>,
      );
    }
    return withActions(
      n,
      checkable ? (
        <ListItem
          key={n.id}
          variant="checkbox"
          title={n.title}
          subtitle={n.subtitle}
          leading={<TreeCheck state={checkedSet.has(n.id)} />}
          trailing={false}
          checked={checkedSet.has(n.id)}
          onCheckedChange={() => pick(n)}
        />
      ) : (
        <ListItem
          key={n.id}
          variant="radio"
          title={n.title}
          subtitle={n.subtitle}
          checked={selected === n.id}
          onCheckedChange={() => pick(n)}
        />
      ),
    );
  };

  // One order everywhere (web dataState): error, then loading, then empty, then the tree.
  const state = isSet(errorState) ? (
    errorState
  ) : rootLoading ? (
    <ListSection>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={{ minHeight: tokens.size.control.xl, justifyContent: 'center', paddingHorizontal: tokens.spacing[4] }}>
          <Skeleton width={i % 2 ? '50%' : '75%'} shape="line" />
        </View>
      ))}
    </ListSection>
  ) : nodes.length === 0 ? (
    isSet(emptyState) ? (
      emptyState
    ) : (
      <Text variant="body-sm" color="on-surface-muted" style={{ textAlign: 'center', padding: tokens.spacing[2] }}>
        {messages.emptyStates.noData.title}
      </Text>
    )
  ) : null;
  if (state != null) {
    return (
      <View accessibilityState={{ busy: rootLoading && !isSet(errorState) }} style={[{ gap: tokens.spacing[2] }, style]}>
        {state}
      </View>
    );
  }

  const busy = here !== undefined && loadingId === here.id;
  return (
    <View style={[{ gap: tokens.spacing[2] }, style]}>
      {here && (
        <ListSection>
          <ListItem
            variant="button"
            title={messages.backTo(parentTitle)}
            leading={<ChevronLeft size="sm" color={roles.primary} />}
            onPress={() => setExpanded(path.slice(0, -1).map((p) => p.id))}
          />
        </ListSection>
      )}
      <ListSection header={here?.title ?? rootTitle}>
        {busy ? (
          <View
            accessible
            accessibilityLabel={messages.loading}
            accessibilityState={{ busy: true }}
            style={{
              minHeight: tokens.size.control.xl,
              flexDirection: 'row',
              alignItems: 'center',
              gap: tokens.spacing[3],
              paddingHorizontal: tokens.spacing[4],
            }}
          >
            <ActivityIndicator color={roles['on-surface-variant']} />
            <Text variant="body-lg" color="on-surface-variant">
              {messages.loading}
            </Text>
          </View>
        ) : (
          list.map(rowFor)
        )}
      </ListSection>
    </View>
  );
}

// ─── StepProgress ────────────────────────────────────────────────────────────

export interface StepProgressProps {
  steps: { id: string; label: string }[];
  /** Index of the step being shown. */
  current: number;
  /** Indexes of finished steps. @default every step before `current` */
  completed?: number[];
  /**
   * Makes steps tappable, called with the step's index. Linear by default: finished steps
   * and the first unfinished one can be reached; the rest wait.
   */
  onStepChange?: (index: number) => void;
  /** Any step can be reached with `onStepChange`, not only finished ones and the next. */
  nonLinear?: boolean;
  /**
   * `horizontal` is the segmented bar with "Step 2 of 4: Billing". `vertical` lists every
   * step with its number (or a check when finished), joined by a line. @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

/** Progress through a multi-step flow (web Stepper on mobile): segments and "Step 2 of 4: Billing", or a vertical list. */
export function StepProgress({
  steps,
  current,
  completed,
  onStepChange,
  nonLinear = false,
  orientation = 'horizontal',
  style,
}: StepProgressProps) {
  const { roles, tokens, messages } = useTheme();
  const done = new Set(completed ?? steps.slice(0, current).map((_, i) => i));
  const firstOpen = steps.findIndex((_, i) => !done.has(i));
  const reachable = (i: number) => !!onStepChange && i !== current && (nonLinear || done.has(i) || i === firstOpen);
  const stepText = (i: number) =>
    [`${messages.stepOf(i + 1, steps.length)}: ${steps[i]?.label ?? ''}`, done.has(i) && i !== current ? messages.stepCompleted : undefined]
      .filter(Boolean)
      .join(', ');
  const text = `${messages.stepOf(current + 1, steps.length)}: ${steps[current]?.label ?? ''}`;

  // A step as a target: a button when it can be reached, else a plain element that still reads its state.
  const target = (i: number, body: React.ReactNode, targetStyle: StyleProp<ViewStyle>) =>
    onStepChange ? (
      <Pressable
        key={steps[i]!.id}
        accessibilityRole="button"
        accessibilityLabel={stepText(i)}
        accessibilityState={{ disabled: !reachable(i), selected: i === current }}
        disabled={!reachable(i)}
        onPress={() => onStepChange(i)}
        pressScale={false}
        stateLayer={orientation === 'vertical' ? undefined : false}
        style={targetStyle}
      >
        {body}
      </Pressable>
    ) : (
      <View
        key={steps[i]!.id}
        accessible={orientation === 'vertical'}
        accessibilityLabel={orientation === 'vertical' ? stepText(i) : undefined}
        accessibilityState={orientation === 'vertical' ? { selected: i === current } : undefined}
        style={targetStyle}
      >
        {body}
      </View>
    );

  if (orientation === 'vertical') {
    return (
      <View style={style}>
        {steps.map((s, i) => {
          const finished = done.has(i) && i !== current;
          const isCurrent = i === current;
          const last = i === steps.length - 1;
          const marker = (
            <View
              style={{
                width: tokens.size.control.sm,
                height: tokens.size.control.sm,
                borderRadius: tokens.shape.control,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: finished ? roles.primary : roles.surface,
                borderWidth: finished ? 0 : 2,
                borderColor: isCurrent ? roles.primary : roles['outline-variant'],
              }}
            >
              {finished ? (
                <Check size="xs" strokeWidth={3} color={roles['on-primary']} />
              ) : (
                <Text variant="label-md" color={isCurrent ? 'primary' : 'on-surface-muted'} tabular>
                  {String(i + 1)}
                </Text>
              )}
            </View>
          );
          return target(
            i,
            <>
              <View style={{ alignItems: 'center' }}>
                {marker}
                {!last && (
                  <View
                    style={{
                      flex: 1,
                      width: tokens.spacing.px,
                      marginVertical: tokens.spacing[1],
                      backgroundColor: finished ? roles.primary : roles['outline-variant'],
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1, paddingTop: tokens.spacing[1], paddingBottom: last ? 0 : tokens.spacing[6] }}>
                <Text variant="label-lg" color={isCurrent || finished ? 'on-surface' : 'on-surface-muted'}>
                  {s.label}
                </Text>
              </View>
            </>,
            { flexDirection: 'row', gap: tokens.spacing[3], borderRadius: tokens.shape.field },
          );
        })}
      </View>
    );
  }

  const segments = steps.map((s, i) => {
    const bar = (
      <View
        key={s.id}
        style={{
          flex: onStepChange ? undefined : 1,
          height: tokens.spacing[1],
          borderRadius: tokens.radius.xs,
          backgroundColor: done.has(i) || i === current ? roles.primary : roles['outline-variant'],
        }}
      />
    );
    // Tappable segments get a taller target around the thin bar.
    return onStepChange ? target(i, bar, { flex: 1, paddingVertical: tokens.spacing[3] }) : bar;
  });

  // Not tappable: one element that reads the position, as before.
  if (!onStepChange) {
    return (
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={text}
        accessibilityValue={{ min: 1, max: steps.length, now: current + 1, text }}
        style={[{ gap: tokens.spacing[2] }, style]}
      >
        <View style={{ flexDirection: 'row', gap: tokens.spacing[1] }}>{segments}</View>
        <Text variant="label-lg" color="on-surface-variant">
          {text}
        </Text>
      </View>
    );
  }
  return (
    <View style={[{ gap: tokens.spacing[2] }, style]}>
      <View style={{ flexDirection: 'row', gap: tokens.spacing[1] }}>{segments}</View>
      <Text variant="label-lg" color="on-surface-variant">
        {text}
      </Text>
    </View>
  );
}

// ─── SortableList ────────────────────────────────────────────────────────────

export interface SortableListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  title: (item: T) => string;
  subtitle?: (item: T) => string | undefined;
  onReorder: (items: T[]) => void;
  /** Shows the move buttons. Screen readers always get Move up / Move down actions. @default true */
  editing?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * A list people reorder (web Sortable on mobile). Move up / down buttons while
 * `editing`, and the same moves as VoiceOver and TalkBack actions on each row.
 */
// ponytail: buttons + accessibility actions, no long-press drag yet; add a
// gesture-handler drag when someone needs to move items far in long lists.
export function SortableList<T>({ items, keyExtractor, title, subtitle, onReorder, editing = true, style }: SortableListProps<T>) {
  const { messages } = useTheme();
  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onReorder(next);
  };
  return (
    <ListSection style={style}>
      {items.map((item, i) => (
        <View
          key={keyExtractor(item)}
          accessible
          accessibilityLabel={[title(item), subtitle?.(item), messages.stepOf(i + 1, items.length)].filter(Boolean).join(', ')}
          accessibilityActions={[
            ...(i > 0 ? [{ name: 'moveUp', label: messages.moveUp }] : []),
            ...(i < items.length - 1 ? [{ name: 'moveDown', label: messages.moveDown }] : []),
          ]}
          onAccessibilityAction={(e) => move(i, e.nativeEvent.actionName === 'moveUp' ? -1 : 1)}
        >
          <ListItem
            title={title(item)}
            subtitle={subtitle?.(item)}
            trailing={
              editing ? (
                <View style={{ flexDirection: 'row' }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
                  <IconButton icon={ArrowUp} label={messages.moveUp} size="sm" disabled={i === 0} onPress={() => move(i, -1)} />
                  <IconButton icon={ArrowDown} label={messages.moveDown} size="sm" disabled={i === items.length - 1} onPress={() => move(i, 1)} />
                </View>
              ) : undefined
            }
          />
        </View>
      ))}
    </ListSection>
  );
}

// ─── InlineEdit ──────────────────────────────────────────────────────────────

/** The type role of InlineEdit's text, from body text up to a headline (as web). */
export type InlineEditSize = 'sm' | 'md' | 'lg' | 'title' | 'headline';

const EDIT_TYPE = {
  sm: 'body-sm',
  md: 'body-md',
  lg: 'body-lg',
  title: 'title-lg',
  headline: 'headline-sm',
} as const;
const EDIT_FIELD = { sm: 'md', md: 'md', lg: 'lg', title: 'xl', headline: 'xl' } as const;

export interface InlineEditProps {
  label: string;
  value: string;
  /** Called on Return or when the field loses focus, if the text changed. */
  onSave: (value: string) => void;
  placeholder?: string;
  /** The text can't be tapped to edit; screen readers hear it as dimmed. */
  disabled?: boolean;
  /** Caps the field's length and shows a "12/80" counter while editing. */
  maxLength?: number;
  /** Type role of the text, from body text up to a headline; the field grows to match. @default 'lg' */
  size?: InlineEditSize;
  style?: StyleProp<ViewStyle>;
}

/** Text that turns into a field when tapped (web InlineEdit on mobile). Return or leaving the field saves. */
export function InlineEdit({
  label,
  value,
  onSave,
  placeholder,
  disabled = false,
  maxLength,
  size = 'lg',
  style,
}: InlineEditProps) {
  const theme = useTheme();
  const { messages, tokens } = theme;
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const done = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };
  if (editing && !disabled) {
    return (
      <TextField
        label={label}
        value={draft}
        onChangeText={setDraft}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={done}
        onBlur={done}
        size={EDIT_FIELD[size]}
        maxLength={maxLength}
        showCount={maxLength !== undefined}
        style={style}
      />
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${messages.editField(label)}, ${value || placeholder || ''}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        setDraft(value);
        setEditing(true);
      }}
      pressScale={false}
      style={[
        { minHeight: tokens.size.control.md, justifyContent: 'center', opacity: disabled ? disabledOpacity(theme) : 1 },
        style,
      ]}
    >
      <Text variant={EDIT_TYPE[size]} color={value ? 'on-surface' : 'on-surface-muted'} numberOfLines={1}>
        {value || placeholder || ''}
      </Text>
    </Pressable>
  );
}
