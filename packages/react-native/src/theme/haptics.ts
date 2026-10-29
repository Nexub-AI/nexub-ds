import { Platform } from 'react-native';

// Semantic haptics (MOBILE_PLAN.md §4.4). Apple's rule: never on plain taps,
// never the only feedback. Android uses the platform constants, not the
// vibrator-based impact API.
export type HapticToken =
  'selection' | 'toggleOn' | 'toggleOff' | 'confirm' | 'reject' | 'warning' | 'snap';

// Optional peer: without expo-haptics every haptic is a no-op.
let H: typeof import('expo-haptics') | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional peer, must not fail when absent
  H = require('expo-haptics');
} catch {
  H = undefined;
}

const ANDROID = {
  selection: 'Segment_Tick',
  toggleOn: 'Toggle_On',
  toggleOff: 'Toggle_Off',
  confirm: 'Confirm',
  reject: 'Reject',
  warning: 'Reject',
  snap: 'Gesture_End',
} as const;

export function playHaptic(token: HapticToken): void {
  if (!H) return;
  const done = () => {};
  if (Platform.OS === 'android') {
    H.performAndroidHapticsAsync(H.AndroidHaptics[ANDROID[token]]).catch(done);
    return;
  }
  if (Platform.OS !== 'ios') return;
  switch (token) {
    case 'selection':
      H.selectionAsync().catch(done);
      break;
    case 'toggleOn':
    case 'toggleOff':
      H.impactAsync(H.ImpactFeedbackStyle.Light).catch(done);
      break;
    case 'snap':
      H.impactAsync(H.ImpactFeedbackStyle.Medium).catch(done);
      break;
    case 'confirm':
      H.notificationAsync(H.NotificationFeedbackType.Success).catch(done);
      break;
    case 'reject':
      H.notificationAsync(H.NotificationFeedbackType.Error).catch(done);
      break;
    case 'warning':
      H.notificationAsync(H.NotificationFeedbackType.Warning).catch(done);
      break;
  }
}
