import * as React from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { MoreHorizontal } from '@nexub/icons/native';
import { Text } from '../primitives/Text';
import { useTheme, type RoleName } from '../theme/ThemeProvider';
import { IconButton } from './actions';
import { Skeleton } from './feedback';
import { ActionSheet, type SheetAction } from './overlays';

// 12.5: the native twin of web Kanban. Same data and callback (`columns`, `getId`, `getLabel`,
// `onChange(columns, move)`), drawn as horizontally scrolling columns. Cards move through a
// "Move to…" sheet that lists the columns (and drop targets), and the same moves are
// VoiceOver and TalkBack actions on each card, so nothing needs a drag.

export interface KanbanColumn<T> {
  id: string;
  title: string;
  items: T[];
}

/** Where a card is: its column. (`laneId` is web's swimlanes; native boards have no lanes yet.) */
export interface KanbanPlace {
  columnId: string;
  laneId?: string;
}

/** What `onChange` and `canMove` are told about a move. */
export interface KanbanMove<T> {
  item: T;
  from: KanbanPlace;
  to: KanbanPlace;
}

/** An action outside the columns a card can be sent to (Archive, Trash). The card leaves the board. */
export interface KanbanDropTarget<T> {
  id: string;
  label: string;
  /** Called with the card and the column it came from. */
  onDrop: (item: T, from: KanbanPlace) => void;
}

export type KanbanCardTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

export interface KanbanProps<T> {
  columns: KanbanColumn<T>[];
  getId: (item: T) => string;
  /** The card's name, read by screen readers and used in the move sheet's title. */
  getLabel: (item: T) => string;
  /**
   * Called with the columns after a move; store them to apply it. The second argument names the
   * card and where it moved. A moved card goes to the end of its new column.
   */
  onChange: (columns: KanbanColumn<T>[], move: KanbanMove<T>) => void;
  renderCard: (item: T) => React.ReactNode;
  /** Shown inside a column that has no cards (while other columns have some). */
  columnEmptyState?: React.ReactNode;
  /** Cards can't be moved: no move button, no move actions. */
  readOnly?: boolean;
  /** Refuse a move before it lands (a WIP limit, a rule): a refused column is left out of the sheet and the actions. */
  canMove?: (move: KanbanMove<T>) => boolean;
  /** Places outside the columns, e.g. Archive: listed after the columns in the move sheet. */
  dropTargets?: KanbanDropTarget<T>[];
  /** Replaces a column's header (title, count, a WIP badge). */
  renderColumnHeader?: (column: KanbanColumn<T>, count: number) => React.ReactNode;
  /** A slot at the end of each column, e.g. a quick-add button. */
  renderColumnFooter?: (column: KanbanColumn<T>) => React.ReactNode;
  /** A coloured start edge on a card (for priority or status; the card should say it in text too). */
  getTone?: (item: T) => KanbanCardTone | undefined;
  /** Column width: 240, 288 or 352 pt. @default 'md' */
  columnWidth?: 'sm' | 'md' | 'lg';
  /** Placeholder columns and cards while the board loads. */
  loading?: boolean;
  /** Shown when no column has a card. @default the "Nothing here yet" text */
  emptyState?: React.ReactNode;
  /** Shown in place of the board when set (a failed load). */
  errorState?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const TONE: Record<Exclude<KanbanCardTone, 'default'>, RoleName> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

/** Columns of cards people move with a "Move to…" sheet or the screen reader's actions (web Kanban on mobile). */
// ponytail: no long-press drag yet. Add a gesture-handler drag when someone needs to move
// many cards fast; the sheet and actions stay the accessible path.
export function Kanban<T>({
  columns,
  getId,
  getLabel,
  onChange,
  renderCard,
  columnEmptyState,
  readOnly = false,
  canMove,
  dropTargets = [],
  renderColumnHeader,
  renderColumnFooter,
  getTone,
  columnWidth = 'md',
  loading = false,
  emptyState,
  errorState,
  style,
  testID,
}: KanbanProps<T>) {
  const { roles, tokens, messages, elevation } = useTheme();
  const [moving, setMoving] = React.useState<{ item: T; from: number } | null>(null);
  const s = tokens.spacing;
  const width = { sm: s[56] + s[4], md: s[64] + s[8], lg: s[88] }[columnWidth];
  const place = (c: number): KanbanPlace => ({ columnId: columns[c]!.id });

  /** The columns a card may move to, as [column index, label]; refused ones are left out. */
  const targets = (item: T, from: number) =>
    columns
      .map((_, c) => c)
      .filter((c) => c !== from && (!canMove || canMove({ item, from: place(from), to: place(c) })));

  const move = (item: T, from: number, to: number) => {
    const id = getId(item);
    const next = columns.map((col, c) =>
      c === from ? { ...col, items: col.items.filter((x) => getId(x) !== id) } : c === to ? { ...col, items: [...col.items, item] } : col,
    );
    onChange(next, { item, from: place(from), to: place(to) });
  };
  const drop = (item: T, from: number, target: KanbanDropTarget<T>) => {
    const id = getId(item);
    target.onDrop(item, place(from));
    const next = columns.map((col, c) => (c === from ? { ...col, items: col.items.filter((x) => getId(x) !== id) } : col));
    onChange(next, { item, from: place(from), to: place(from) });
  };

  const columnBox: ViewStyle = {
    width,
    gap: s[2],
    padding: s[3],
    borderRadius: tokens.shape.container,
    backgroundColor: roles['surface-container-low'],
  };

  let body: React.ReactNode;
  if (errorState != null) {
    body = errorState;
  } else if (loading) {
    body = (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: s[4] }}>
        {(columns.length ? columns.map((c) => c.id) : ['a', 'b', 'c']).map((key) => (
          <View key={key} style={columnBox} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Skeleton width="50%" shape="line" />
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height={s[12]} radius="control" />
            ))}
          </View>
        ))}
      </ScrollView>
    );
  } else if (columns.every((c) => c.items.length === 0)) {
    body =
      emptyState ?? (
        <Text variant="body-md" color="on-surface-muted" style={{ textAlign: 'center', paddingVertical: s[8] }}>
          {messages.emptyStates.noData.title}
        </Text>
      );
  } else {
    body = (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: s[4], alignItems: 'flex-start' }}>
        {columns.map((col, c) => (
          <View key={col.id} style={columnBox} accessibilityLabel={col.title}>
            {renderColumnHeader ? (
              renderColumnHeader(col, col.items.length)
            ) : (
              <View accessible accessibilityRole="header" style={{ flexDirection: 'row', alignItems: 'center', gap: s[2] }}>
                <Text variant="title-sm" style={{ flex: 1 }} numberOfLines={1}>
                  {col.title}
                </Text>
                <Text variant="label-md" color="on-surface-muted" tabular>
                  {col.items.length}
                </Text>
              </View>
            )}
            {col.items.length === 0 && columnEmptyState != null && (
              <View style={{ alignItems: 'center', paddingVertical: s[2] }}>
                {typeof columnEmptyState === 'string' ? (
                  <Text variant="body-sm" color="on-surface-muted" style={{ textAlign: 'center' }}>
                    {columnEmptyState}
                  </Text>
                ) : (
                  columnEmptyState
                )}
              </View>
            )}
            {col.items.map((item) => {
              const tone = getTone?.(item);
              const label = getLabel(item);
              const to = readOnly ? [] : targets(item, c);
              const sendTo = readOnly ? [] : dropTargets;
              const movable = to.length + sendTo.length > 0;
              return (
                <View
                  key={getId(item)}
                  testID={testID ? `${testID}-card-${getId(item)}` : undefined}
                  accessible
                  accessibilityLabel={`${label}, ${col.title}`}
                  accessibilityActions={[
                    ...to.map((t) => ({ name: `column:${columns[t]!.id}`, label: messages.moveToColumn(columns[t]!.title) })),
                    ...sendTo.map((t) => ({ name: `target:${t.id}`, label: t.label })),
                  ]}
                  onAccessibilityAction={(e) => {
                    const [kind, id] = splitAction(e.nativeEvent.actionName);
                    if (kind === 'column') {
                      const t = columns.findIndex((x) => x.id === id);
                      if (t >= 0 && to.includes(t)) move(item, c, t);
                    } else {
                      const t = sendTo.find((x) => x.id === id);
                      if (t) drop(item, c, t);
                    }
                  }}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: s[1],
                      padding: s[2],
                      borderRadius: tokens.shape.field,
                      backgroundColor: roles.surface,
                      boxShadow: elevation(1),
                    },
                    tone && tone !== 'default' && { borderStartWidth: s[1], borderStartColor: roles[TONE[tone]] },
                  ]}
                >
                  <View style={{ flex: 1, minWidth: 0, paddingTop: s['0-5'] }}>{renderCard(item)}</View>
                  {movable && (
                    // The card itself carries the actions for screen readers; the button is for touch.
                    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                      <IconButton
                        icon={MoreHorizontal}
                        label={messages.moveItem(label)}
                        size="sm"
                        onPress={() => setMoving({ item, from: c })}
                      />
                    </View>
                  )}
                </View>
              );
            })}
            {renderColumnFooter?.(col)}
          </View>
        ))}
      </ScrollView>
    );
  }

  const sheet: SheetAction[] = moving
    ? [
        ...targets(moving.item, moving.from).map((t) => ({
          label: columns[t]!.title,
          onPress: () => move(moving.item, moving.from, t),
        })),
        ...dropTargets.map((t) => ({ label: t.label, onPress: () => drop(moving.item, moving.from, t) })),
      ]
    : [];

  return (
    <View testID={testID} style={style} accessibilityState={{ busy: loading }}>
      {body}
      {!readOnly && (
        <ActionSheet
          open={moving != null}
          onOpenChange={(open) => !open && setMoving(null)}
          title={moving ? getLabel(moving.item) : undefined}
          message={messages.moveCardTo}
          actions={sheet}
        />
      )}
    </View>
  );
}

const splitAction = (name: string): [string, string] => {
  const at = name.indexOf(':');
  return [name.slice(0, at), name.slice(at + 1)];
};
