// Docs previews (nexub.design/m/preview/…): one component or screen, full-bleed,
// themed from the query (?scheme=dark&brand=payub&contrast=high&dir=rtl). On the web
// the docs page that frames it can switch theme live with
//   iframe.contentWindow.postMessage({ type: 'nexub-theme', scheme, brand, contrast }, origin)
// Only same-origin messages are accepted.
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReduceMotion, ReducedMotionConfig } from 'react-native-reanimated';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { NexubNativeProvider, ToastProvider, useNexubNavigation, type ContrastLevel } from '@nexub/react-native';
import { BRANDS, type Brand } from '../../preview/catalog';

interface PreviewTheme {
  scheme: 'light' | 'dark' | 'system';
  brand: Brand;
  contrast: ContrastLevel | 'system';
  /** Layout direction; 'auto' follows the locale (English: ltr). */
  dir: 'auto' | 'ltr' | 'rtl';
}

const SCHEMES = ['light', 'dark', 'system'] as const;
const CONTRASTS = ['standard', 'medium', 'high', 'system'] as const;
const DIRS = ['auto', 'ltr', 'rtl'] as const;
const pick = <T extends string>(list: readonly T[], value: unknown, fallback: T): T =>
  list.includes(value as T) ? (value as T) : fallback;

function parse(src: Record<string, unknown>, base?: PreviewTheme): PreviewTheme {
  return {
    scheme: pick(SCHEMES, src.scheme, base?.scheme ?? 'system'),
    brand: pick(BRANDS, src.brand, base?.brand ?? 'nexub'),
    contrast: pick(CONTRASTS, src.contrast, base?.contrast ?? 'system'),
    dir: pick(DIRS, src.dir, base?.dir ?? 'auto'),
  };
}

function Screens() {
  const nav = useNexubNavigation();
  return <Stack screenOptions={{ ...nav.stack, headerShown: false }} />;
}

export default function PreviewLayout() {
  const params = useGlobalSearchParams<{ scheme?: string; brand?: string; contrast?: string; dir?: string }>();
  const [theme, setTheme] = useState(() => parse(params));

  useEffect(() => setTheme((t) => parse(params, t)), [params.scheme, params.brand, params.contrast, params.dir]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as Record<string, unknown> | null;
      if (data?.type === 'nexub-theme') setTheme((t) => parse(data, t));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    // Already under the app root's GestureHandlerRootView; nesting is harmless
    // and keeps the previews self-contained (they bring their own provider too).
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Native previews are screenshot targets: show each one at rest. An entering
          animation (Banner's nxEnter) that hadn't started yet passed Maestro's settle
          check and gave a blank banner--0 on Android (run 45309299542). Web keeps motion. */}
      {Platform.OS !== 'web' && <ReducedMotionConfig mode={ReduceMotion.Always} />}
      <NexubNativeProvider
        scheme={theme.scheme}
        contrast={theme.contrast}
        product={theme.brand === 'nexub' ? undefined : theme.brand}
        dir={theme.dir === 'auto' ? undefined : theme.dir}
      >
        <ToastProvider>
          <Screens />
        </ToastProvider>
      </NexubNativeProvider>
    </GestureHandlerRootView>
  );
}
