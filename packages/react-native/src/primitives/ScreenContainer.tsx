import * as React from 'react';
import { ScrollView, View, type ScrollViewProps, type ViewStyle } from 'react-native';
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

/**
 * The root of every screen: background, edge-to-edge safe-area insets and
 * content padding. With `scroll`, iOS adjusts insets itself
 * (contentInsetAdjustmentBehavior) so native large titles collapse.
 */
export function ScreenContainer({
  scroll = true,
  edges = ['left', 'right', 'bottom'],
  background = 'surface',
  padding = '4',
  gap = '4',
  contentStyle,
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
      <View style={[{ flex: 1, backgroundColor: roles[background] }, inner, contentStyle, style]}>
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={[{ flex: 1, backgroundColor: roles[background] }, style]}
      contentContainerStyle={[inner, contentStyle]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
