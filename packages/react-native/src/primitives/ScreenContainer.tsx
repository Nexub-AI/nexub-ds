import * as React from 'react';
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  ScrollView,
  View,
  type KeyboardEvent,
  type ScrollViewProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import { useTheme, type RoleName } from '../theme/ThemeProvider';
import type { Space } from './Layout';
import { ErrorState } from '../components/feedback';

export interface ScreenContainerProps extends Omit<ScrollViewProps, 'contentContainerStyle'> {
  /** Scrolls (and lets a native large title collapse). @default true */
  scroll?: boolean;
  /** Safe-area edges to pad. A native header already covers 'top'. @default ['left', 'right', 'bottom'] */
  edges?: Edge[];
  /** @default 'surface' */
  background?: RoleName;
  /** Content padding. @default '4' */
  padding?: Space;
  /** Gap between children. @default '4' */
  gap?: Space;
  contentStyle?: ViewStyle;
  /**
   * Keeps the focused input above the keyboard. Turn it off inside StickyFooter
   * or your own KeyboardAvoidingView, which already make room. @default true
   */
  keyboardAvoiding?: boolean;
  /** Shown in place of content that threw while rendering. Default: ErrorState with Retry. */
  errorFallback?: React.ReactNode | ((state: { error: unknown; reset: () => void }) => React.ReactNode);
  /** Called with the error, for reporting (Sentry, Crashlytics). */
  onError?: (error: unknown, info: React.ErrorInfo) => void;
}

function DefaultFallback({ reset }: { reset: () => void }) {
  const { title, description } = useTheme().messages.emptyStates.serverError;
  return <ErrorState title={title} description={description} onRetry={reset} />;
}

/**
 * Catches a render error in the screen's content (9.5). An uncaught one closes a release
 * build; here the screen stays up and shows a fallback with Retry, which renders it again.
 */
class ContentBoundary extends React.Component<
  Pick<ScreenContainerProps, 'errorFallback' | 'onError'> & { children?: React.ReactNode },
  { failed: boolean; error: unknown }
> {
  override state = { failed: false, error: undefined as unknown };
  static getDerivedStateFromError(error: unknown) {
    return { failed: true, error };
  }
  override componentDidCatch(error: unknown, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }
  reset = () => this.setState({ failed: false, error: undefined });
  override render() {
    if (!this.state.failed) return this.props.children;
    const { errorFallback } = this.props;
    if (typeof errorFallback === 'function') return errorFallback({ error: this.state.error, reset: this.reset });
    return errorFallback ?? <DefaultFallback reset={this.reset} />;
  }
}

type ViewRef = React.ComponentRef<typeof View>;

/**
 * How much of `ref`'s view the keyboard covers, measured in the window (so a
 * header above the screen needs no offset). 0 where the OS already made room:
 * an Android window that resized (`adjustResize`) no longer overlaps the
 * keyboard, an edge-to-edge one that did not resize does.
 */
function useKeyboardInset(ref: React.RefObject<ViewRef | null>, enabled: boolean) {
  const [inset, setInset] = React.useState(0);
  const applied = React.useRef(0);
  React.useEffect(() => {
    if (!enabled) return;
    const set = (next: number, e: KeyboardEvent) => {
      if (next === applied.current) return;
      applied.current = next;
      // Move with the keyboard (iOS reports its curve), as KeyboardAvoidingView does.
      if (e.duration && e.easing) {
        const duration = Math.max(e.duration, 10);
        LayoutAnimation.configureNext({
          duration,
          update: { duration, type: LayoutAnimation.Types[e.easing] ?? 'keyboard' },
        });
      }
      setInset(next);
    };
    const show = (e: KeyboardEvent) =>
      ref.current?.measureInWindow((_x, y, _w, height) =>
        // The view is already `applied` shorter: add that back before comparing.
        set(Math.max(0, Math.round(y + height + applied.current - e.endCoordinates.screenY)), e),
      );
    const hide = (e: KeyboardEvent) => set(0, e);
    const ios = Platform.OS === 'ios';
    const subs = [
      // iOS: before the keyboard moves, so the screen travels with it; then once
      // more when it lands, in case a parent made room in the meantime.
      ...(ios ? [Keyboard.addListener('keyboardWillChangeFrame', show)] : []),
      Keyboard.addListener('keyboardDidShow', show),
      Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', hide),
    ];
    return () => subs.forEach((s) => s.remove());
  }, [enabled, ref]);
  return enabled ? inset : 0;
}

/**
 * The root of every screen: background, edge-to-edge safe-area insets and
 * content padding. With `scroll`, iOS adjusts insets itself
 * (contentInsetAdjustmentBehavior) so native large titles collapse.
 *
 * `keyboardAvoiding` (on by default) keeps the focused input visible: a
 * scrolling screen on iOS uses the scroll view's own keyboard insets;
 * everywhere else the screen ends where the keyboard begins.
 */
export function ScreenContainer({
  scroll = true,
  edges = ['left', 'right', 'bottom'],
  background = 'surface',
  padding = '4',
  gap = '4',
  contentStyle,
  keyboardAvoiding = true,
  errorFallback,
  onError,
  children: content,
  style,
  ...rest
}: ScreenContainerProps) {
  const { roles, tokens } = useTheme();
  const children = (
    <ContentBoundary errorFallback={errorFallback} onError={onError}>
      {content}
    </ContentBoundary>
  );
  const insets = useSafeAreaInsets();
  const outer = React.useRef<ViewRef>(null);
  const nativeInsets = scroll && Platform.OS === 'ios';
  const keyboard = useKeyboardInset(outer, keyboardAvoiding && !nativeInsets);
  // Only while the keyboard covers the screen: nothing changes at rest.
  const lift = keyboard > 0 && { marginBottom: keyboard };
  const pad = tokens.spacing[padding];
  const inner: ViewStyle = {
    paddingTop: pad + (edges.includes('top') ? insets.top : 0),
    paddingBottom: pad + (edges.includes('bottom') ? insets.bottom : 0),
    paddingStart: pad + (edges.includes('left') ? insets.left : 0),
    paddingEnd: pad + (edges.includes('right') ? insets.right : 0),
    gap: tokens.spacing[gap],
  };
  if (!scroll) {
    return (
      <View
        ref={outer}
        style={[{ flex: 1, backgroundColor: roles[background] }, inner, contentStyle, style, lift]}
      >
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      ref={outer as unknown as React.Ref<React.ComponentRef<typeof ScrollView>>}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={keyboardAvoiding}
      style={[{ flex: 1, backgroundColor: roles[background] }, style, lift]}
      contentContainerStyle={[inner, contentStyle]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
