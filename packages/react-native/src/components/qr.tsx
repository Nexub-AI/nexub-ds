import * as React from 'react';
import { AccessibilityInfo, Linking, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { encodeQR, qrPath, type QRErrorCorrection } from '@nexub/core';
import { Zap } from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Text } from '../primitives/Text';
import { useHaptics, useTheme } from '../theme/ThemeProvider';
import { Button, IconButton } from './actions';

// ─── QRCode ──────────────────────────────────────────────────────────────────

export interface QRCodeProps extends ViewProps {
  /** The text to encode, usually a URL. Up to 2,953 bytes of UTF-8 (1,273 with a logo). */
  value: string;
  /** Width of the code in points. @default 160 */
  size?: number;
  /** Error correction: how much of the code may be damaged or covered. @default 'M', or 'H' with a `logo` */
  ecc?: QRErrorCorrection;
  /** A mark in the centre, on a light tile a fifth of the width. Raises the default `ecc` to 'H'. */
  logo?: React.ReactNode;
  /** Light margin around the code, in modules. Readers need 4. @default 4 */
  quietZone?: number;
  /** Text alternative of the image. @default "QR code for <value>" */
  label?: string;
  /** The text under the code. Defaults to the value, so it can be read and typed without a camera. `false` hides it. */
  caption?: React.ReactNode | false;
}

/**
 * A QR code drawn with react-native-svg. Always dark on light, in dark mode too,
 * since readers expect that; the value (or `caption`) shows as text beneath it.
 */
export function QRCode({ value, size = 160, ecc, logo, quietZone = 4, label, caption, style, ...rest }: QRCodeProps) {
  const { tokens, messages } = useTheme();
  // The light scheme's roles whatever the theme: a code must not invert.
  const light = tokens.color.roles.standard.light;
  const hasLogo = logo != null && logo !== false;
  const level = ecc ?? (hasLogo ? 'H' : 'M');
  const quiet = Math.max(0, Math.floor(quietZone));
  const { d, box } = React.useMemo(() => {
    const qr = encodeQR(value, { ecc: level });
    return { d: qrPath(qr.modules, quiet), box: qr.size + quiet * 2 };
  }, [value, level, quiet]);
  return (
    <View style={[{ width: size, maxWidth: '100%', alignItems: 'center', gap: tokens.spacing[2] }, style]} {...rest}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={label ?? messages.qrCodeFor(value)}
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: tokens.shape.min,
          backgroundColor: light['surface-container-lowest'],
        }}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${box} ${box}`}>
          {/* A hairline stroke in the fill colour closes the seams anti-aliasing leaves between rows. */}
          <Path d={d} fill={light['on-surface']} stroke={light['on-surface']} strokeWidth={0.04} />
        </Svg>
        {hasLogo && (
          <View
            style={{
              position: 'absolute',
              width: size / 5,
              height: size / 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: tokens.shape.min,
              backgroundColor: light['surface-container-lowest'],
            }}
          >
            {logo}
          </View>
        )}
      </View>
      {caption !== false && (
        <Text variant="body-sm" color="on-surface-variant" selectable style={{ textAlign: 'center' }}>
          {caption ?? value}
        </Text>
      )}
    </View>
  );
}

// ─── QRScanner ───────────────────────────────────────────────────────────────

// The part of expo-camera this file uses (SDK 51+), typed by hand: it is an
// optional peer, so its own types may not be installed.
interface CameraPermission {
  granted: boolean;
  canAskAgain: boolean;
}
interface CameraModule {
  CameraView: React.ComponentType<{
    style?: StyleProp<ViewStyle>;
    facing?: 'back' | 'front';
    active?: boolean;
    enableTorch?: boolean;
    barcodeScannerSettings?: { barcodeTypes: string[] };
    onBarcodeScanned?: (result: { data: string }) => void;
  }>;
  useCameraPermissions: () => [CameraPermission | null, () => Promise<unknown>];
}

// Optional peer: without expo-camera the scanner shows its fallback.
let Cam: CameraModule | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional peer, must not fail when absent
  Cam = require('expo-camera');
} catch {
  Cam = undefined;
}
const useNoCamera: CameraModule['useCameraPermissions'] = () => [null, () => Promise.resolve()];
// Fixed for the life of the app, so the hook order never changes.
const useCameraPermissions = Cam?.useCameraPermissions ?? useNoCamera;

/** The same code is not reported again within this many ms (cameras fire on every frame). */
const REPEAT_MS = 2000;

export interface QRScannerProps {
  /** Called with the text of each code found. The same code is not repeated within two seconds. */
  onScan: (value: string) => void;
  /** Manual entry, e.g. a TextField and a button. Shown when there is no camera or no permission, and one tap away while scanning. */
  fallback?: React.ReactNode;
  /** Stops the camera and ignores codes, e.g. while the last one is checked. */
  paused?: boolean;
  /** Controlled torch. */
  torch?: boolean;
  /** @default false */
  defaultTorch?: boolean;
  onTorchChange?: (on: boolean) => void;
  /** Hint over the camera. @default messages.scanInstructions */
  instructions?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Scans QR codes with the camera (native only). Needs the optional peer
 * `expo-camera`; without it, or without permission, the `fallback` shows instead,
 * and while scanning it stays one tap away, so there is always a way in by hand.
 */
export function QRScanner({ onScan, fallback, paused, torch, defaultTorch = false, onTorchChange, instructions, style }: QRScannerProps) {
  const { roles, tokens, messages } = useTheme();
  const play = useHaptics();
  const [permission, request] = useCameraPermissions();
  const [torchOn, setTorch] = useControllableState({ value: torch, defaultValue: defaultTorch, onChange: onTorchChange });
  const [manual, setManual] = React.useState(false);
  const last = React.useRef({ value: '', at: 0 });

  const found = ({ data }: { data: string }) => {
    if (paused || !data) return;
    const now = Date.now();
    if (data === last.current.value && now - last.current.at < REPEAT_MS) return;
    last.current = { value: data, at: now };
    play('confirm');
    AccessibilityInfo.announceForAccessibility(messages.codeScanned);
    onScan(data);
  };

  const gap = { gap: tokens.spacing[4] };
  if (!Cam) {
    return <View style={[gap, style]}>{fallback ?? <Text color="on-surface-variant">{messages.cameraUnavailable}</Text>}</View>;
  }
  if (!permission?.granted) {
    // Still loading: an empty block, so nothing flashes before the answer is known.
    if (!permission) return <View style={[gap, style]} />;
    const ask = permission.canAskAgain;
    return (
      <View style={[gap, style]}>
        <Text color="on-surface-variant" accessibilityLiveRegion="polite">
          {ask ? messages.cameraPermission : messages.cameraDenied}
        </Text>
        <Button variant="tonal" onPress={() => void (ask ? request() : Linking.openSettings())}>
          {ask ? messages.allowCamera : messages.openSettings}
        </Button>
        {fallback}
      </View>
    );
  }
  if (manual && fallback != null) {
    return (
      <View style={[gap, style]}>
        {fallback}
        <Button variant="text" onPress={() => setManual(false)}>
          {messages.scanCode}
        </Button>
      </View>
    );
  }
  // Over a camera picture: the light scheme's lightest surface for the frame, whatever the theme.
  const frame = tokens.color.roles.standard.light['surface-container-lowest'];
  return (
    <View style={[gap, style]}>
      <View style={{ aspectRatio: 1, overflow: 'hidden', borderRadius: tokens.shape.container, backgroundColor: roles.scrim }}>
        <Cam.CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          active={!paused}
          enableTorch={torchOn}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={paused ? undefined : found}
        />
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <View testID="qr-scanner-frame" style={{ width: '64%', aspectRatio: 1, borderWidth: 2, borderColor: frame, borderRadius: tokens.shape.container }} />
        </View>
        <View style={{ position: 'absolute', start: tokens.spacing[3], end: tokens.spacing[3], bottom: tokens.spacing[3], flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[2] }}>
          <View style={{ flex: 1, paddingVertical: tokens.spacing[2], paddingHorizontal: tokens.spacing[3], borderRadius: tokens.shape.field, backgroundColor: roles['inverse-surface'] }}>
            <Text variant="label-md" color="inverse-on-surface">
              {instructions ?? messages.scanInstructions}
            </Text>
          </View>
          <IconButton icon={Zap} label={messages.torch} variant="tonal" selected={torchOn} haptic={torchOn ? 'toggleOff' : 'toggleOn'} onPress={() => setTorch(!torchOn)} />
        </View>
      </View>
      {fallback != null && (
        <Button variant="text" onPress={() => setManual(true)}>
          {messages.enterCodeManually}
        </Button>
      )}
    </View>
  );
}
