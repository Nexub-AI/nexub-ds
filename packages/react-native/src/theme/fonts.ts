// Nexub faces as static TTFs (OFL) from @expo-google-fonts, one file per weight.
// Load them once at startup:  const [ready] = useFonts(nexubFonts)  (expo-font).
// Per-weight subpaths don't import expo-font, so bare RN apps can load the same
// files with their own loader.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { GeistMono_400Regular } from '@expo-google-fonts/geist-mono/400Regular';

export const nexubFonts = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  GeistMono_400Regular,
};

export type FontFamily = 'sans' | 'display' | 'mono';
export type FontSource = 'nexub' | 'system';

const SANS: Record<number, string> = {
  400: 'Inter_400Regular',
  500: 'Inter_500Medium',
  600: 'Inter_600SemiBold',
  700: 'Inter_700Bold',
  800: 'Inter_700Bold',
};
const DISPLAY: Record<number, string> = {
  400: 'PlusJakartaSans_600SemiBold',
  500: 'PlusJakartaSans_600SemiBold',
  600: 'PlusJakartaSans_600SemiBold',
  700: 'PlusJakartaSans_700Bold',
  800: 'PlusJakartaSans_800ExtraBold',
};

/**
 * Style for a family + weight. With static files the weight lives in the file
 * name, so `fontWeight` is only set for the system font (Android picks the
 * wrong file when both are set).
 */
export function fontStyle(family: FontFamily, weight: number, source: FontSource) {
  if (source === 'system') return { fontWeight: String(weight) as '400' };
  if (family === 'mono') return { fontFamily: 'GeistMono_400Regular' };
  return { fontFamily: (family === 'display' ? DISPLAY : SANS)[weight] ?? SANS[400] };
}
