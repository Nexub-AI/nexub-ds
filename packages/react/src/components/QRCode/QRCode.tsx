import * as React from 'react';
import { defaultMessages, encodeQR, qrPath, type QRErrorCorrection } from '@nexub/core';
import { cn } from '../../utils/cn.js';

export interface QRCodeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The text to encode, usually a URL. Up to 2,953 bytes of UTF-8 (1,273 with a logo). */
  value: string;
  /** Width of the code: a number of pixels, or any CSS length. It never grows past its container. @default 160 */
  size?: number | string;
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
 * A QR code as an SVG (10.9). It is always dark on light, in dark mode too, since
 * readers expect that; the value (or `caption`) shows as text beneath it. A server
 * component: the default label is English, pass `label` to translate it.
 */
export const QRCode = React.forwardRef<HTMLElement, QRCodeProps>(
  ({ value, size = 160, ecc, logo, quietZone = 4, label, caption, className, style, ...props }, ref) => {
    const hasLogo = logo != null && logo !== false;
    const { modules, size: count } = encodeQR(value, { ecc: ecc ?? (hasLogo ? 'H' : 'M') });
    const quiet = Math.max(0, Math.floor(quietZone));
    const box = count + quiet * 2;
    return (
      <figure
        ref={ref}
        data-nx="qr-code"
        className={cn('m-0 inline-flex max-w-full flex-col items-center gap-2', className)}
        style={{ width: size, ...style }}
        {...props}
      >
        {/* data-theme="light" pins the colour roles to their light values: dark modules on a light tile in every theme. */}
        <span
          data-theme="light"
          className="relative block w-full overflow-hidden rounded-shape-min bg-[var(--color-surface-container-lowest)] forced-color-adjust-none"
        >
          <svg
            role="img"
            aria-label={label ?? defaultMessages.qrCodeFor(value)}
            viewBox={`0 0 ${box} ${box}`}
            shapeRendering="crispEdges"
            className="block h-auto w-full fill-[var(--color-on-surface)]"
          >
            <path d={qrPath(modules, quiet)} />
          </svg>
          {hasLogo && (
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 grid size-1/5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-shape-min bg-[var(--color-surface-container-lowest)] p-0.5 text-[var(--color-on-surface)] [&>img]:size-full [&>svg]:size-full"
            >
              {logo}
            </span>
          )}
        </span>
        {caption !== false && (
          <figcaption className="max-w-full break-all text-center text-body-sm text-[var(--color-on-surface-variant)]">
            {caption ?? value}
          </figcaption>
        )}
      </figure>
    );
  },
);
QRCode.displayName = 'QRCode';
