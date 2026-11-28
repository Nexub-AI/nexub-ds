import * as React from 'react';
import { BackHandler, View, type StyleProp, type ViewStyle } from 'react-native';
import { ArrowLeft, type NativeIconProps } from '@nexub/icons/native';
import { IconButton } from '../components/actions';
import { Skeleton } from '../components/feedback';
import { useNexubMessages, useTheme } from '../theme/ThemeProvider';
import { useWindowSizeClass } from '../theme/layout';

// ─── ListDetail (12.5) ───────────────────────────────────────────────────────
// The M3 list-detail canonical layout. Medium and expanded windows (≥ 600dp:
// tablets, unfolded foldables, phones in landscape) show both panes side by
// side; compact windows show one pane at a time, the detail pushed over the list.

const LIST_WIDTH = { sm: 288, md: 320, lg: 400 } as const;

export interface ListDetailProps {
  list: React.ReactNode;
  detail: React.ReactNode;
  /**
   * On compact windows (one pane at a time), show the detail instead of the list.
   * Set it when an item is selected. Ignored when both panes show.
   */
  showDetail?: boolean;
  /**
   * Called by the back button and by Android's back gesture, on compact windows
   * while the detail shows. Omit it to hide the button (e.g. when your stack header has one).
   */
  onBack?: () => void;
  /** @default messages.back ('Back') */
  backLabel?: string;
  /** Fixed list width when both panes show: sm 288, md 320, lg 400. @default 'md' */
  listWidth?: 'sm' | 'md' | 'lg';
  /**
   * The list pane's share of the width when both panes show, from 0.2 to 0.8
   * (e.g. 0.4). Wins over `listWidth`.
   */
  splitRatio?: number;
  /** Accessible names for the two panes. @default messages.listPane / messages.detailPane */
  listLabel?: string;
  detailLabel?: string;
  /** Skeleton rows in the list pane, which reads as busy. */
  loading?: boolean;
  /** Shown in the list pane in place of `list`. Pass it when the list has no items. */
  emptyState?: React.ReactNode;
  /** Shown in the list pane in place of `list`; wins over `loading` and `emptyState`. */
  errorState?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Flips the back arrow in right-to-left layouts. */
function BackArrow(props: NativeIconProps) {
  const { dir } = useTheme();
  return <ArrowLeft {...props} style={[props.style, dir === 'rtl' && { transform: [{ scaleX: -1 }] }]} />;
}

/**
 * List and detail side by side from the medium window size class up; one pane
 * at a time on compact windows. Each pane fills its height; bring your own
 * scrolling (a FlatList such as ActivityList, or a ScrollView), as on any screen.
 *
 * ```tsx
 * <ListDetail
 *   list={<ActivityList transactions={txs} onPress={(t) => setSelected(t.id)} />}
 *   detail={selected ? <TransactionDetail transaction={tx} /> : <EmptyState title="Pick a payment" />}
 *   showDetail={!!selected}
 *   onBack={() => setSelected(null)}
 * />
 * ```
 */
export function ListDetail({
  list,
  detail,
  showDetail = false,
  onBack,
  backLabel,
  listWidth = 'md',
  splitRatio,
  listLabel,
  detailLabel,
  loading,
  emptyState,
  errorState,
  style,
}: ListDetailProps) {
  const { roles, tokens } = useTheme();
  const messages = useNexubMessages();
  const split = useWindowSizeClass() !== 'compact';
  const detailOnly = !split && showDetail;

  // Android back closes the pushed detail, like a stack screen.
  const back = React.useRef(onBack);
  back.current = onBack;
  const handlesBack = detailOnly && !!onBack;
  React.useEffect(() => {
    if (!handlesBack) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      back.current?.();
      return true;
    });
    return () => sub.remove();
  }, [handlesBack]);

  const busy = !!loading && errorState == null;
  const listContent =
    errorState ??
    (loading ? (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[3], paddingHorizontal: tokens.spacing[4], paddingVertical: tokens.spacing[3] }}
          >
            <Skeleton shape="circle" width={40} />
            <View style={{ flex: 1, gap: tokens.spacing[2] }}>
              <Skeleton width="50%" />
              <Skeleton width="80%" />
            </View>
          </View>
        ))}
      </View>
    ) : (
      (emptyState ?? list)
    ));

  const ratio = splitRatio == null ? undefined : Math.min(0.8, Math.max(0.2, splitRatio));
  const listPane = (
    <View
      testID="list-detail-list"
      accessibilityLabel={listLabel ?? messages.listPane}
      accessibilityState={busy ? { busy } : undefined}
      style={
        split
          ? [
              ratio == null ? { width: LIST_WIDTH[listWidth] } : { flexBasis: `${ratio * 100}%`, flexGrow: 0, flexShrink: 0 },
              { borderEndWidth: tokens.spacing.px, borderEndColor: roles['outline-variant'] },
            ]
          : { flex: 1 }
      }
    >
      {listContent}
    </View>
  );
  const detailPane = (
    <View testID="list-detail-detail" accessibilityLabel={detailLabel ?? messages.detailPane} style={{ flex: 1, minWidth: 0 }}>
      {detailOnly && onBack && (
        <View style={{ padding: tokens.spacing[2], alignItems: 'flex-start' }}>
          <IconButton icon={BackArrow} label={backLabel ?? messages.back} onPress={onBack} />
        </View>
      )}
      <View style={{ flex: 1 }}>{detail}</View>
    </View>
  );

  return (
    <View style={[{ flex: 1, flexDirection: split ? 'row' : 'column' }, style]}>
      {split ? (
        <>
          {listPane}
          {detailPane}
        </>
      ) : detailOnly ? (
        detailPane
      ) : (
        listPane
      )}
    </View>
  );
}
