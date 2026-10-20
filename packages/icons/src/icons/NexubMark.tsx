import { forwardRef, useId, type FC, type SVGProps } from 'react';
import { createIcon } from '../createIcon.js';
import type { IconProps } from '../Icon.js';
import { NEXUB_MARK_GRADIENTS, NEXUB_MARK_PATHS } from './nexubMarkData.js';

// The official mark (@nexub/brand assets/nexub-mark.svg). Mono merges its
// shapes into one path so there are no seams where they overlap.
const MONO_PATH = NEXUB_MARK_PATHS.map((p) => p.d).join(' ');

// Must match the class names build-assets.mjs writes into base.css.
const stopClass = (s: { color: number; opacity?: number }) =>
  `nxm-s-${s.color}${s.opacity === undefined ? '' : ` nxm-o-${String(s.opacity).replace('.', '_')}`}`;

type NexubMarkSvgProps = SVGProps<SVGSVGElement> & { variant?: 'mono' | 'color' };

const NexubMarkSvg = /* @__PURE__ */ forwardRef<SVGSVGElement, NexubMarkSvgProps>(
  // strokeWidth comes from createIcon; the mark is filled, so drop it.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function NexubMarkSvg({ width = 24, height = 24, strokeWidth, variant = 'mono', ...props }, ref) {
    // Gradient ids must be unique per instance; useId() can contain ':'.
    const uid = `nxm${useId().replace(/[^\w-]/g, '')}`;
    return (
      <svg ref={ref} viewBox="0 0 78 56" width={width} height={height} fill="currentColor" {...props}>
        {variant === 'mono' ? (
          <path d={MONO_PATH} />
        ) : (
          <>
            <defs>
              {NEXUB_MARK_GRADIENTS.map((g, i) => (
                <linearGradient
                  key={i}
                  id={`${uid}-${i}`}
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  gradientUnits="userSpaceOnUse"
                >
                  {g.stops.map((s, j) => (
                    // Classes, not style=: server-rendered style attributes are
                    // blocked by a strict CSP. Rules: @nexub/themes base.css.
                    <stop key={j} offset={s.offset} className={stopClass(s)} />
                  ))}
                </linearGradient>
              ))}
            </defs>
            {NEXUB_MARK_PATHS.map((p, i) => (
              <path key={i} d={p.d} fill={`url(#${uid}-${p.gradient})`} />
            ))}
          </>
        )}
      </svg>
    );
  },
);

export interface NexubMarkProps extends IconProps {
  /** `mono` (default) fills with `currentColor`; `color` uses the brand-mark tokens. */
  variant?: 'mono' | 'color';
}

export const NexubMark = /* @__PURE__ */ createIcon(NexubMarkSvg, 'NexubMark') as FC<NexubMarkProps>;
