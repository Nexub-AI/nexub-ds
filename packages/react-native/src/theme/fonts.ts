// Nexub faces as static TTFs (OFL) from @expo-google-fonts, one file per weight.
// Load them once at startup:  const [ready] = useFonts(nexubFonts)  (expo-font).
// Per-weight subpaths don't import expo-font, so bare RN apps can load the same
// files with their own loader.
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { GeistMono_400Regular } from '@expo-google-fonts/geist-mono/400Regular';

export const nexubFonts = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  GeistMono_400Regular,
};

export type FontFamily = 'sans' | 'display' | 'mono';
export type FontSource = 'nexub' | 'system';
/**
 * What the theme resolves `fonts` to. 'nexub-bold' is the Nexub faces with the OS Bold Text
 * setting on (9.4): iOS only thickens system fonts by itself, so each weight steps up to the
 * next heavier file here.
 */
export type ResolvedFontSource = FontSource | 'nexub-bold';
const BOLDER: Record<number, number> = { 400: 600, 500: 700, 600: 700, 700: 800, 800: 800 };

// One typeface since 10.1: the interface text is Plus Jakarta Sans too.
const SANS: Record<number, string> = {
  400: 'PlusJakartaSans_400Regular',
  500: 'PlusJakartaSans_500Medium',
  600: 'PlusJakartaSans_600SemiBold',
  700: 'PlusJakartaSans_700Bold',
  800: 'PlusJakartaSans_800ExtraBold',
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
export function fontStyle(family: FontFamily, weight: number, source: ResolvedFontSource) {
  if (source === 'system') return { fontWeight: String(weight) as '400' };
  if (family === 'mono') return { fontFamily: 'GeistMono_400Regular' };
  const w = source === 'nexub-bold' ? (BOLDER[weight] ?? weight) : weight;
  return { fontFamily: (family === 'display' ? DISPLAY : SANS)[w] ?? SANS[400] };
}
