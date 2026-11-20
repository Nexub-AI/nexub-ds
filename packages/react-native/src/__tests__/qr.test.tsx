/* eslint-disable @typescript-eslint/no-require-imports -- jest mocks are loaded lazily inside factories */
// 10.9: QRCode and QRScanner. expo-camera cannot run in Jest, so it is mocked:
// these tests cover the permission states, the scan callback and the fallbacks.
// Only a device can confirm that the camera really reads a code.
import * as React from 'react';
import { AccessibilityInfo, Linking } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import Svg, { Path } from 'react-native-svg';
import { native } from '@nexub/tokens/native';
import { NexubNativeProvider, QRCode, QRScanner, Text, encodeQR, qrPath } from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: { Success: 'success' },
  AndroidHaptics: {},
}));

const mockCamera: { permission: { granted: boolean; canAskAgain: boolean } | null; request: jest.Mock } = {
  permission: { granted: true, canAskAgain: true },
  request: jest.fn(() => Promise.resolve()),
};
jest.mock(
  'expo-camera',
  () => {
    const { createElement } = require('react');
    const { View } = require('react-native');
    return {
      CameraView: (props: object) => createElement(View, { testID: 'camera', ...props }),
      useCameraPermissions: () => [mockCamera.permission, mockCamera.request],
    };
  },
  { virtual: true },
);

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="dark" contrast="standard">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(<Provider>{ui}</Provider>);
type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
const nodes = (n: unknown = screen.toJSON()): Node[] => {
  if (!n || typeof n !== 'object') return [];
  if (Array.isArray(n)) return n.flatMap((c) => nodes(c));
  const node = n as Node;
  return [node, ...nodes(node.children)];
};
const style = (n: { props: Record<string, unknown> }) => Object.assign({}, ...[n.props.style].flat(Infinity as 1).filter(Boolean));
const light = native.color.roles.standard.light;
const URL = 'https://example.com/h/4729';
const fallback = <Text>Type the code</Text>;
const scan = (data: string) => act(() => screen.getByTestId('camera').props.onBarcodeScanned({ data }));

beforeEach(() => {
  mockCamera.permission = { granted: true, canAskAgain: true };
  mockCamera.request.mockClear();
});
afterEach(() => jest.restoreAllMocks());

describe('QRCode', () => {
  it('is an image named after its value, with the value as text beneath', async () => {
    await wrap(<QRCode value={URL} />);
    expect(screen.getByRole('image', { name: `QR code for ${URL}` })).toBeTruthy();
    expect(screen.getByText(URL)).toBeTruthy();
  });

  it('takes a label and a caption, or no caption', async () => {
    await wrap(<QRCode value={URL} label="Pay order 4729" caption="Order 4729" />);
    expect(screen.getByRole('image', { name: 'Pay order 4729' })).toBeTruthy();
    expect(screen.getByText('Order 4729')).toBeTruthy();
    await screen.rerender(<Provider><QRCode value={URL} caption={false} /></Provider>);
    expect(screen.queryByText(URL)).toBeNull();
  });

  it('draws the matrix as one path, dark on light even in the dark scheme', async () => {
    // The second path is the reference: the expected fill as react-native-svg encodes it.
    await wrap(
      <>
        <QRCode value={URL} size={200} />
        <Svg>
          <Path d="M0 0" fill={light['on-surface']} />
        </Svg>
      </>,
    );
    const tile = screen.getByRole('image');
    expect(style(tile)).toMatchObject({ width: 200, height: 200, backgroundColor: light['surface-container-lowest'] });
    const paths = nodes().filter((n) => n.type === 'RNSVGPath');
    expect(paths).toHaveLength(2);
    const { modules, size } = encodeQR(URL, { ecc: 'M' });
    const svg = nodes().find((n) => n.type === 'RNSVGSvgView')!;
    expect(svg.props).toMatchObject({ minX: 0, minY: 0, vbWidth: size + 8, vbHeight: size + 8 });
    // The fill is the light scheme's text colour, not the dark theme's.
    expect(light['on-surface']).not.toBe(native.color.roles.standard.dark['on-surface']);
    expect(paths[0]!.props.fill).toEqual(paths[1]!.props.fill);
    expect(paths[0]!.props.fill).toBeDefined();
    expect(paths[0]!.props.d).toBe(qrPath(modules, 4));
  });

  it('a logo raises the error correction to H, on a tile a fifth of the width', async () => {
    await wrap(<QRCode value={URL} size={200} logo={<Text testID="mark">N</Text>} />);
    const withLogo = nodes().find((n) => n.type === 'RNSVGPath')!.props.d;
    const tile = nodes().find((n) => style(n).position === 'absolute')!;
    expect(style(tile)).toMatchObject({ width: 40, height: 40, backgroundColor: light['surface-container-lowest'] });
    await screen.rerender(<Provider><QRCode value={URL} size={200} ecc="H" /></Provider>);
    expect(nodes().find((n) => n.type === 'RNSVGPath')!.props.d).toEqual(withLogo);
    await screen.rerender(<Provider><QRCode value={URL} size={200} /></Provider>);
    expect(nodes().find((n) => n.type === 'RNSVGPath')!.props.d).not.toEqual(withLogo);
  });
});

describe('QRScanner', () => {
  it('reports a code once, with a haptic and an announcement; repeats are dropped for two seconds', async () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    const now = jest.spyOn(Date, 'now').mockReturnValue(10_000);
    const onScan = jest.fn();
    await wrap(<QRScanner onScan={onScan} />);
    expect(screen.getByText('Point the camera at a QR code')).toBeTruthy();
    expect(screen.getByTestId('qr-scanner-frame')).toBeTruthy();
    expect(screen.getByTestId('camera').props).toMatchObject({ facing: 'back', active: true, enableTorch: false, barcodeScannerSettings: { barcodeTypes: ['qr'] } });
    await scan('NX-4729');
    await scan('NX-4729');
    expect(onScan).toHaveBeenCalledTimes(1);
    expect(onScan).toHaveBeenCalledWith('NX-4729');
    expect(announce).toHaveBeenCalledWith('Code scanned');
    expect(require('expo-haptics').notificationAsync).toHaveBeenCalled();
    // Another code is reported at once; the first again after the window.
    await scan('NX-5000');
    expect(onScan).toHaveBeenCalledTimes(2);
    now.mockReturnValue(12_500);
    await scan('NX-5000');
    expect(onScan).toHaveBeenCalledTimes(3);
  });

  it('`paused` stops the camera and ignores codes; `instructions` replaces the hint', async () => {
    const onScan = jest.fn();
    await wrap(<QRScanner onScan={onScan} paused instructions="Scan the code on the receipt" />);
    expect(screen.getByText('Scan the code on the receipt')).toBeTruthy();
    const camera = screen.getByTestId('camera');
    expect(camera.props.active).toBe(false);
    expect(camera.props.onBarcodeScanned).toBeUndefined();
    expect(onScan).not.toHaveBeenCalled();
  });

  it('toggles the torch, uncontrolled and controlled', async () => {
    const onTorchChange = jest.fn();
    await wrap(<QRScanner onScan={() => {}} onTorchChange={onTorchChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Flashlight' }));
    expect(onTorchChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByTestId('camera').props.enableTorch).toBe(true);
    await fireEvent.press(screen.getByRole('button', { name: 'Flashlight' }));
    expect(onTorchChange).toHaveBeenLastCalledWith(false);
    await screen.rerender(<Provider><QRScanner onScan={() => {}} torch onTorchChange={onTorchChange} /></Provider>);
    expect(screen.getByTestId('camera').props.enableTorch).toBe(true);
    await fireEvent.press(screen.getByRole('button', { name: 'Flashlight' }));
    expect(onTorchChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByTestId('camera').props.enableTorch).toBe(true);
  });

  it('asks for the camera first, with the manual entry already there', async () => {
    mockCamera.permission = { granted: false, canAskAgain: true };
    await wrap(<QRScanner onScan={() => {}} fallback={fallback} />);
    expect(screen.queryByTestId('camera')).toBeNull();
    expect(screen.getByText('Allow camera access to scan a code.')).toBeTruthy();
    expect(screen.getByText('Type the code')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Allow camera' }));
    expect(mockCamera.request).toHaveBeenCalledTimes(1);
  });

  it('when denied for good, sends the user to Settings and keeps the manual entry', async () => {
    mockCamera.permission = { granted: false, canAskAgain: false };
    const open = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
    await wrap(<QRScanner onScan={() => {}} fallback={fallback} />);
    expect(screen.getByText('Camera access is off. Turn it on in Settings to scan a code.')).toBeTruthy();
    expect(screen.getByText('Type the code')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Open settings' }));
    expect(open).toHaveBeenCalledTimes(1);
    expect(mockCamera.request).not.toHaveBeenCalled();
  });

  it('renders nothing readable while the permission is still unknown', async () => {
    mockCamera.permission = null;
    await wrap(<QRScanner onScan={() => {}} fallback={fallback} />);
    expect(screen.queryByTestId('camera')).toBeNull();
    expect(screen.queryByText('Type the code')).toBeNull();
  });

  it('while scanning, manual entry is one tap away, and back', async () => {
    await wrap(<QRScanner onScan={() => {}} fallback={fallback} />);
    expect(screen.queryByText('Type the code')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Enter code manually' }));
    expect(screen.getByText('Type the code')).toBeTruthy();
    expect(screen.queryByTestId('camera')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Scan a code' }));
    expect(screen.getByTestId('camera')).toBeTruthy();
  });

  it('without a fallback there is no manual-entry button', async () => {
    await wrap(<QRScanner onScan={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Enter code manually' })).toBeNull();
  });
});
