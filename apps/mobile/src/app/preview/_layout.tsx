// Docs previews (nexub.design/m/preview/…): one component or screen, full-bleed,
// themed from the query (?scheme=dark&brand=payub&contrast=high). On the web
// the docs page that frames it can switch theme live with
//   iframe.contentWindow.postMessage({ type: 'nexub-theme', scheme, brand, contrast }, origin)
// Only same-origin messages are accepted.
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { NexubNativeProvider, ToastProvider, useNexubNavigation, type ContrastLevel } from '@nexub/react-native';
import { BRANDS, type Brand } from '../../preview/catalog';

interface PreviewTheme {
  scheme: 'light' | 'dark' | 'system';
  brand: Brand;
  contrast: ContrastLevel | 'system';
}

const SCHEMES = ['light', 'dark', 'system'] as const;
const CONTRASTS = ['standard', 'medium', 'high', 'system'] as const;
const pick = <T extends string>(list: readonly T[], value: unknown, fallback: T): T =>
  list.includes(value as T) ? (value as T) : fallback;

function parse(src: Record<string, unknown>, base?: PreviewTheme): PreviewTheme {
  return {
    scheme: pick(SCHEMES, src.scheme, base?.scheme ?? 'system'),
    brand: pick(BRANDS, src.brand, base?.brand ?? 'nexub'),
    contrast: pick(CONTRASTS, src.contrast, base?.contrast ?? 'system'),
  };
}

function Screens() {
  const nav = useNexubNavigation();
  return <Stack screenOptions={{ ...nav.stack, headerShown: false }} />;
}

export default function PreviewLayout() {
  const params = useGlobalSearchParams<{ scheme?: string; brand?: string; contrast?: string }>();
  const [theme, setTheme] = useState(() => parse(params));

  useEffect(() => setTheme((t) => parse(params, t)), [params.scheme, params.brand, params.contrast]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <NexubNativeProvider
      scheme={theme.scheme}
      contrast={theme.contrast}
      product={theme.brand === 'nexub' ? undefined : theme.brand}
    >
      <ToastProvider>
        <Screens />
      </ToastProvider>
    </NexubNativeProvider>
  );
}
