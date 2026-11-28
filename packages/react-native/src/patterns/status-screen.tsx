import * as React from 'react';
import { View } from 'react-native';
import { Button } from '../components/actions';
import { Illustration } from '../components/illustration';
import { StickyFooter } from '../components/mobile';
import { Heading, Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';

export type StatusScreenKind = 'notFound' | 'serverError' | 'maintenance' | 'offline' | 'noAccess';

export interface StatusScreenProps {
  /** notFound (404), serverError (500), maintenance, offline or noAccess (403). */
  kind: StatusScreenKind;
  /** Overrides the localised title (`messages.emptyStates[kind]`); the description too. */
  title?: string;
  description?: string;
  /** A small line above the title, e.g. "404". */
  code?: string;
  /** Buttons pinned at the bottom. Replaces the default Retry or Back to home. */
  actions?: React.ReactNode;
  /** Art above the text. Defaults to the `Illustration` for the kind; `null` hides it. */
  illustration?: React.ReactNode;
  /** serverError and offline: shows a Retry button (when no `actions` are given). */
  onRetry?: () => void;
  /** notFound and noAccess: shows a "Back to home" button (when no `actions` are given). Native for web `homeHref`. */
  onHome?: () => void;
  testID?: string;
}

/**
 * A whole screen for one state (12.5, web StatusPage): not found, server error, maintenance,
 * offline or no access. Centred, with one header; server error and offline are announced.
 * Its buttons sit above the home indicator, like ResultScreen's.
 */
export function StatusScreen({
  kind,
  title,
  description,
  code,
  actions,
  illustration,
  onRetry,
  onHome,
  testID,
}: StatusScreenProps) {
  const { roles, tokens, messages } = useTheme();
  const text = messages.emptyStates[kind];
  const urgent = kind === 'serverError' || kind === 'offline';
  const buttons =
    actions ??
    (urgent && onRetry ? (
      <Button size="lg" fullWidth onPress={onRetry}>
        {messages.retry}
      </Button>
    ) : (kind === 'notFound' || kind === 'noAccess') && onHome ? (
      <Button size="lg" fullWidth onPress={onHome}>
        {messages.backToHome}
      </Button>
    ) : null);

  const body = (
    <View
      testID={testID}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: tokens.spacing[6],
        padding: tokens.spacing[6],
        backgroundColor: roles.surface,
      }}
    >
      {illustration === undefined ? <Illustration kind={kind} size="lg" /> : illustration}
      <View
        accessibilityRole={urgent ? 'alert' : undefined}
        accessibilityLiveRegion={urgent ? 'assertive' : undefined}
        style={{ alignItems: 'center', gap: tokens.spacing[2] }}
      >
        {code && (
          <Text variant="label-lg" color="on-surface-variant">
            {code}
          </Text>
        )}
        <Heading variant="headline-sm" style={{ textAlign: 'center' }}>
          {title ?? text.title}
        </Heading>
        <Text variant="body-lg" color="on-surface-variant" style={{ textAlign: 'center' }}>
          {description ?? text.description}
        </Text>
      </View>
    </View>
  );
  return buttons ? <StickyFooter footer={buttons}>{body}</StickyFooter> : body;
}
