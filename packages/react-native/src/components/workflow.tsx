import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { ArrowDown, ArrowUp, ChevronLeft } from '@nexub/icons/native';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { IconButton } from './actions';
import { ListItem, ListSection } from './containers';
import { TextField } from './inputs';

// ─── TreeList ────────────────────────────────────────────────────────────────

export interface TreeListNode {
  id: string;
  title: string;
  subtitle?: string;
  children?: TreeListNode[];
}

export interface TreeListProps {
  nodes: TreeListNode[];
  /** Title of the top level, shown on the back row from the first level down. */
  rootTitle: string;
  /** The picked leaf. */
  selected?: string | null;
  onSelect?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * A hierarchy as drill-down lists (web TreeView on mobile): rows with children
 * open the next level, leaves are picked, and a back row returns.
 */
export function TreeList({ nodes, rootTitle, selected, onSelect, style }: TreeListProps) {
  const { roles, messages } = useTheme();
  const [path, setPath] = React.useState<TreeListNode[]>([]);
  const here = path.at(-1);
  const list = here?.children ?? nodes;
  const parentTitle = path.length > 1 ? path.at(-2)!.title : rootTitle;

  return (
    <View style={[{ gap: 8 }, style]}>
      {here && (
        <ListSection>
          <ListItem
            variant="button"
            title={messages.backTo(parentTitle)}
            leading={<ChevronLeft size="sm" color={roles.primary} />}
            onPress={() => setPath(path.slice(0, -1))}
          />
        </ListSection>
      )}
      <ListSection header={here?.title ?? rootTitle}>
        {list.map((n) =>
          n.children?.length ? (
            <ListItem
              key={n.id}
              variant="navigation"
              title={n.title}
              subtitle={n.subtitle}
              value={String(n.children.length)}
              onPress={() => setPath([...path, n])}
            />
          ) : (
            <ListItem
              key={n.id}
              variant="radio"
              title={n.title}
              subtitle={n.subtitle}
              checked={selected === n.id}
              onCheckedChange={() => onSelect?.(n.id)}
            />
          ),
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
  style?: StyleProp<ViewStyle>;
}

/** Progress through a multi-step flow (web Stepper on mobile): segments and "Step 2 of 4: Billing". */
export function StepProgress({ steps, current, style }: StepProgressProps) {
  const { roles, messages } = useTheme();
  const text = `${messages.stepOf(current + 1, steps.length)}: ${steps[current]?.label ?? ''}`;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={text}
      accessibilityValue={{ min: 1, max: steps.length, now: current + 1, text }}
      style={[{ gap: 8 }, style]}
    >
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {steps.map((s, i) => (
          <View
            key={s.id}
            style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i <= current ? roles.primary : roles['outline-variant'] }}
          />
        ))}
      </View>
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

export interface InlineEditProps {
  label: string;
  value: string;
  /** Called on Return or when the field loses focus, if the text changed. */
  onSave: (value: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

/** Text that turns into a field when tapped (web InlineEdit on mobile). Return or leaving the field saves. */
export function InlineEdit({ label, value, onSave, placeholder, style }: InlineEditProps) {
  const { messages, tokens } = useTheme();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const done = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };
  if (editing) {
    return (
      <TextField
        label={label}
        value={draft}
        onChangeText={setDraft}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={done}
        onBlur={done}
        style={style}
      />
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${messages.editField(label)}, ${value || placeholder || ''}`}
      onPress={() => {
        setDraft(value);
        setEditing(true);
      }}
      pressScale={false}
      style={[{ minHeight: tokens.size.control.md, justifyContent: 'center' }, style]}
    >
      <Text variant="body-lg" color={value ? 'on-surface' : 'on-surface-muted'} numberOfLines={1}>
        {value || placeholder || ''}
      </Text>
    </Pressable>
  );
}
