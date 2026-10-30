'use client';

import * as React from 'react';
import { SegmentedControl, Text } from '@nexub/react';

type Device = 'ios' | 'android';

const DEVICES: Record<Device, { label: string; w: number; h: number; radius: number }> = {
  ios: { label: 'iPhone', w: 393, h: 852, radius: 55 },
  android: { label: 'Pixel', w: 412, h: 892, radius: 44 },
};

/** The docs' theme and brand, read from <html> (ThemeProvider + BrandSwitcher). */
function readTheme() {
  const el = document.documentElement;
  return {
    scheme: el.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    brand: el.getAttribute('data-product') ?? 'nexub',
  };
}

/**
 * A live @nexub/react-native preview (the showcase app's web export under
 * /m), framed as a phone. Follows the docs' theme and brand without reloading.
 */
export function PhoneFrame({
  path,
  title,
  height = 640,
}: {
  /** Preview path inside the mobile export, e.g. `preview/button`. */
  path: string;
  title: string;
  height?: number;
}) {
  const [device, setDevice] = React.useState<Device>('ios');
  const [theme, setTheme] = React.useState<{ scheme: string; brand: string } | null>(null);
  const frame = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-product'] });
    return () => mo.disconnect();
  }, []);

  // Live theme switch inside the frame; the query string covers the first load.
  React.useEffect(() => {
    if (!theme) return;
    frame.current?.contentWindow?.postMessage({ type: 'nexub-theme', ...theme }, window.location.origin);
  }, [theme]);

  const d = DEVICES[device];
  const scale = height / d.h;
  // The query string uses the theme at first load only, so later theme changes
  // switch live (postMessage) instead of reloading; a device change reloads.
  const first = React.useRef<{ scheme: string; brand: string } | null>(null);
  if (theme && !first.current) first.current = theme;
  const src = first.current
    ? `/m/${path}?scheme=${first.current.scheme}&brand=${first.current.brand}&platform=${device}`
    : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <SegmentedControl.Root size="sm" aria-label="Device" value={device} onValueChange={(v) => v && setDevice(v as Device)}>
        {(Object.keys(DEVICES) as Device[]).map((k) => (
          <SegmentedControl.Item key={k} value={k}>
            {DEVICES[k].label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <div
        className="relative shrink-0 overflow-hidden bg-[var(--color-inverse-surface)] p-[10px] shadow-elevation-3"
        style={{ width: d.w * scale + 20, height: height + 20, borderRadius: d.radius * scale + 10 }}
      >
        <div
          className="relative overflow-hidden bg-[var(--color-surface)]"
          style={{ width: d.w * scale, height, borderRadius: d.radius * scale }}
        >
          {src && (
            <iframe
              ref={frame}
              key={device}
              src={src}
              title={`${title}: live preview on ${d.label}`}
              loading="lazy"
              className="absolute left-0 top-0 origin-top-left border-0"
              style={{ width: d.w, height: d.h, transform: `scale(${scale})` }}
              onLoad={() => theme && frame.current?.contentWindow?.postMessage({ type: 'nexub-theme', ...theme }, window.location.origin)}
            />
          )}
          {/* Status-bar cutout: Dynamic Island on iPhone, punch-hole on Pixel. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
            style={
              device === 'ios'
                ? { top: 11 * scale, width: 124 * scale, height: 36 * scale }
                : { top: 12 * scale, width: 26 * scale, height: 26 * scale }
            }
          />
        </div>
      </div>
      <Text size="caption" tone="muted" className="max-w-[40ch] text-center">
        Interactive preview of @nexub/react-native rendered for the web. Native chrome (switches, pickers, Liquid Glass) looks
        like the platform on a device.
      </Text>
    </div>
  );
}
