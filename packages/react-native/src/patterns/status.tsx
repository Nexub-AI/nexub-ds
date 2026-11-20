import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { AlertCircle, Check } from '@nexub/icons/native';
import { Text } from '../primitives/Text';
import { fontStyle } from '../theme/fonts';
import { useTheme, type RoleName } from '../theme/ThemeProvider';

export type StatusStepStatus = 'done' | 'current' | 'upcoming' | 'error';

export interface StatusStep {
  /** Stable key. @default the step's position */
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  status: StatusStepStatus;
  /** When it happened, e.g. "Mon, 10:30". */
  timestamp?: React.ReactNode;
  /** A link or small button for this step, e.g. "Upload again". */
  action?: React.ReactNode;
}

export interface StatusStepsProps extends Omit<ViewProps, 'children'> {
  steps: StatusStep[];
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Names the list for screen readers, e.g. "Application status". */
  accessibilityLabel: string;
}

const isText = (node: React.ReactNode): node is string | number => typeof node === 'string' || typeof node === 'number';

/**
 * Where something stands, as a read-only list of steps (web StatusSteps): an
 * application under review, an order on its way. Each step says its status in
 * text for screen readers, so the marker is never the only signal. For a flow
 * the user moves through, use `StepProgress`.
 */
export function StatusSteps({ steps, size = 'md', style, ...rest }: StatusStepsProps) {
  const { roles, tokens, fonts, messages } = useTheme();
  const statusText: Record<StatusStepStatus, string> = {
    done: messages.stepCompleted,
    current: messages.stepCurrent,
    upcoming: messages.stepUpcoming,
    error: messages.stepProblem,
  };
  const sm = size === 'sm';
  const marker = tokens.spacing[sm ? 5 : 6];
  const titleColor: Record<StatusStepStatus, RoleName> = { done: 'on-surface', current: 'on-surface', upcoming: 'on-surface-muted', error: 'error' };
  return (
    <View accessibilityRole="list" style={style} {...rest}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        const filled = step.status === 'done' || step.status === 'error';
        const fill = step.status === 'error' ? roles.error : roles.primary;
        // One element per step: "Completed: Documents received, Mon 10:30, …". The action stays its own element.
        const spoken = isText(step.title)
          ? [`${statusText[step.status]}: ${step.title}`, step.timestamp, step.description].filter(isText).join(', ')
          : undefined;
        return (
          <View key={step.id ?? i} testID={`status-step-${step.status}`} style={{ flexDirection: 'row', gap: tokens.spacing[sm ? 2 : 3] }}>
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: marker,
                  height: marker,
                  borderRadius: tokens.radius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: filled ? fill : roles.surface,
                  borderWidth: filled ? 0 : 2,
                  borderColor: step.status === 'current' ? roles.primary : roles['outline-variant'],
                }}
              >
                {step.status === 'done' && <Check size="xs" color={roles['on-primary']} />}
                {step.status === 'error' && <AlertCircle size="xs" color={roles['on-error']} />}
                {step.status === 'current' && (
                  <View style={{ width: tokens.spacing[2], height: tokens.spacing[2], borderRadius: tokens.radius.full, backgroundColor: roles.primary }} />
                )}
              </View>
              {/* The line to the next step: solid once this step is done, muted after. */}
              {!last && (
                <View
                  style={{
                    flex: 1,
                    width: 1,
                    marginVertical: tokens.spacing[1],
                    backgroundColor: step.status === 'done' ? roles.primary : roles['outline-variant'],
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1, gap: tokens.spacing['0-5'], paddingBottom: last ? 0 : tokens.spacing[sm ? 4 : 6] }}>
              <View accessible accessibilityLabel={spoken} accessibilityState={{ selected: step.status === 'current' }} style={{ gap: tokens.spacing['0-5'] }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', columnGap: tokens.spacing[3] }}>
                  {isText(step.title) ? (
                    <Text variant={sm ? 'label-md' : 'label-lg'} color={titleColor[step.status]} style={[{ flexShrink: 1 }, fontStyle('sans', 500, fonts)]}>
                      {step.title}
                    </Text>
                  ) : (
                    step.title
                  )}
                  {isText(step.timestamp) ? (
                    <Text variant="body-sm" color="on-surface-muted" tabular>
                      {step.timestamp}
                    </Text>
                  ) : (
                    step.timestamp
                  )}
                </View>
                {isText(step.description) ? (
                  <Text variant="body-sm" color="on-surface-variant">
                    {step.description}
                  </Text>
                ) : (
                  step.description
                )}
              </View>
              {step.action != null && <View style={{ marginTop: tokens.spacing[1], alignItems: 'flex-start' }}>{step.action}</View>}
            </View>
          </View>
        );
      })}
    </View>
  );
}
