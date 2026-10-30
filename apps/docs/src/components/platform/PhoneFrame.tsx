'use client';

import * as React from 'react';
import { SegmentedControl, Text } from '@nexub/react';

type Device = 'ios' | 'android';

const DEVICES: Record<Device, { label: string; w: number; h: number; radius: number; statusBar: number }> = {
  ios: { label: 'iPhone', w: 393, h: 852, radius: 55, statusBar: 54 },
  android: { label: 'Pixel', w: 412, h: 892, radius: 44, statusBar: 40 },
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
        data-live-preview
        className="relative shrink-0 overflow-hidden bg-[var(--color-inverse-surface)] p-[10px] shadow-elevation-3"
        style={{ width: d.w * scale + 20, height: height + 20, borderRadius: d.radius * scale + 10 }}
      >
        <div
          className="relative overflow-hidden bg-[var(--color-surface)]"
          style={{ width: d.w * scale, height, borderRadius: d.radius * scale }}
        >
          {/* Status bar: the preview starts below it, as under a native safe area. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 flex items-center justify-between font-semibold text-[var(--color-on-surface)]"
            style={{ height: d.statusBar * scale, paddingInline: (device === 'ios' ? 34 : 22) * scale, fontSize: 15 * scale }}
          >
            <span>9:41</span>
            <span className="flex items-center" style={{ gap: 5 * scale }}>
              <span className="rounded-[2px] bg-current" style={{ width: 17 * scale, height: 10 * scale, opacity: 0.9 }} />
              <span className="rounded-[3px] border border-current" style={{ width: 24 * scale, height: 11 * scale }} />
            </span>
          </div>
          {src && (
            <iframe
              ref={frame}
              key={device}
              src={src}
              title={`${title}: live preview on ${d.label}`}
              loading="lazy"
              className="absolute left-0 origin-top-left border-0"
              style={{ top: d.statusBar * scale, width: d.w, height: d.h - d.statusBar, transform: `scale(${scale})` }}
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
