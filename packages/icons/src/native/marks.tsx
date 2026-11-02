// The custom Nexub icons from src/icons, for React Native (react-native-svg).
// Same names and glyphs as web; colour comes from `color`, not currentColor.
import { useId, type ComponentType, type ReactNode } from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, type SvgProps } from 'react-native-svg';
import { createIcon, type NativeIconProps } from './createIcon.js';
import { NEXUB_MARK_COLORS, NEXUB_MARK_GRADIENTS, NEXUB_MARK_PATHS } from '../icons/nexubMarkData.js';

type GlyphProps = SvgProps & { size: number; strokeWidth: number; color: string };

// The 24×24 stroke glyphs, drawn like Lucide.
function glyph(children: ReactNode) {
  return function Glyph({ size, strokeWidth, color, ...rest }: GlyphProps) {
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
      >
        {children}
      </Svg>
    );
  };
}

export const LeapMark = /* @__PURE__ */ createIcon(
  glyph(
    <>
      <Rect x="3" y="11" width="18" height="10" rx="1" />
      <Path d="M9 11V7a3 3 0 0 1 6 0v4" />
      <Path d="M12 7V3" />
      <Path d="M9 5l3-2 3 2" />
    </>,
  ),
  'LeapMark',
);

export const BookubMark = /* @__PURE__ */ createIcon(
  glyph(
    <>
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <Path d="M8 10h8" />
      <Path d="M8 14h6" />
    </>,
  ),
  'BookubMark',
);

export const PayubMark = /* @__PURE__ */ createIcon(
  glyph(
    <>
      <Rect x="3" y="5" width="18" height="14" rx="2" />
      <Path d="M3 10h18" />
      <Path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6" />
      <Path d="M9 12v6" />
    </>,
  ),
  'PayubMark',
);

export const FounderubMark = /* @__PURE__ */ createIcon(
  glyph(
    <>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M12 2v3" />
      <Path d="M12 19v3" />
      <Path d="M2 12h3" />
      <Path d="M19 12h3" />
      <Path d="m4.93 4.93 2.12 2.12" />
      <Path d="m16.95 16.95 2.12 2.12" />
      <Path d="m16.95 7.05 2.12-2.12" />
      <Path d="m4.93 19.07 2.12-2.12" />
    </>,
  ),
  'FounderubMark',
);

export const ACRA = /* @__PURE__ */ createIcon(
  glyph(
    <>
      <Path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4z" />
      <Path d="M9 12l2 2 4-4" />
    </>,
  ),
  'ACRA',
);

export const IRAS = /* @__PURE__ */ createIcon(
  glyph(
    <>
      <Rect x="4" y="3" width="16" height="18" rx="2" />
      <Path d="M9 7h6" />
      <Path d="M9 11h6" />
      <Path d="M9 15h4" />
      <Circle cx="16" cy="17" r="2" />
    </>,
  ),
  'IRAS',
);

export const MCA = /* @__PURE__ */ createIcon(
  glyph(
    <>
      <Circle cx="12" cy="12" r="9" />
      <Circle cx="12" cy="12" r="2" />
      <Path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <Path d="m5.64 5.64 2.12 2.12M16.24 16.24l2.12 2.12M16.24 7.76l2.12-2.12M5.64 18.36l2.12-2.12" />
    </>,
  ),
  'MCA',
);

export const GST = /* @__PURE__ */ createIcon(
  glyph(
    <>
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Path d="M14 2v6h6" />
      <Path d="M9 13h1" />
      <Path d="M15 13h-1" />
      <Path d="M9 17h6" />
      <Circle cx="10" cy="11" r="1" />
      <Circle cx="14" cy="15" r="1" />
      <Path d="m10 15 4-4" />
    </>,
  ),
  'GST',
);

// The official mark. Mono merges its shapes into one path (no seams where they overlap).
const MONO_PATH = NEXUB_MARK_PATHS.map((p) => p.d).join(' ');

function NexubMarkSvg({
  size,
  color,
  variant = 'mono',
  // The mark is filled, so the stroke width createIcon passes is unused.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  strokeWidth,
  ...rest
}: GlyphProps & { variant?: 'mono' | 'color' }) {
  // Gradient ids must be unique per instance; useId() can contain ':'.
  const uid = `nxm${useId().replace(/[^\w-]/g, '')}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 78 56" {...rest}>
      {variant === 'mono' ? (
        <Path d={MONO_PATH} fill={color} />
      ) : (
        <>
          <Defs>
            {NEXUB_MARK_GRADIENTS.map((g, i) => (
              <LinearGradient
                key={i}
                id={`${uid}-${i}`}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                gradientUnits="userSpaceOnUse"
              >
                {g.stops.map((s, j) => (
                  <Stop
                    key={j}
                    offset={s.offset}
                    stopColor={NEXUB_MARK_COLORS[s.color - 1]}
                    stopOpacity={'opacity' in s ? s.opacity : 1}
                  />
                ))}
              </LinearGradient>
            ))}
          </Defs>
          {NEXUB_MARK_PATHS.map((p, i) => (
            <Path key={i} d={p.d} fill={`url(#${uid}-${p.gradient})`} />
          ))}
        </>
      )}
    </Svg>
  );
}

export interface NexubMarkProps extends NativeIconProps {
  /** `mono` (default) fills with `color`; `color` uses the brand-mark colours. */
  variant?: 'mono' | 'color';
}

export const NexubMark = /* @__PURE__ */ createIcon(NexubMarkSvg, 'NexubMark') as ComponentType<NexubMarkProps>;
