import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useIntlLocale } from '../NexubProvider/NexubProvider.js';

/** A run of already-formatted text with its own class (Amount's muted symbol and minor units). */
export interface NumberTickerPart {
  value: string;
  className?: string;
}

export interface NumberTickerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** A number (formatted with `format`/`locale`), an already-formatted string, or styled parts. */
  value: number | string | readonly NumberTickerPart[];
  format?: Intl.NumberFormatOptions;
  /** BCP 47 locale. Defaults to the user's. */
  locale?: string;
  /** Announce changes to screen readers. */
  'aria-live'?: 'off' | 'polite';
}

// Literal classes (no style attribute): the strip is 10 lines tall, so each
// step is 10% of its own height.
const SHIFT = [
  'translate-y-0',
  '-translate-y-[10%]',
  '-translate-y-[20%]',
  '-translate-y-[30%]',
  '-translate-y-[40%]',
  '-translate-y-[50%]',
  '-translate-y-[60%]',
  '-translate-y-[70%]',
  '-translate-y-[80%]',
  '-translate-y-[90%]',
];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function Char({ char, className, enter }: { char: string; className?: string; enter: boolean }) {
  // Only characters that appear after the first render fade in (never on SSR/hydration).
  const [entering] = React.useState(enter);
  const motion = entering ? { 'data-motion': 'from-fade' } : {};
  if (!/^[0-9]$/.test(char)) {
    return (
      <span className={cn(entering && 'nx-motion', className)} {...motion}>
        {char}
      </span>
    );
  }
  return (
    <span
      data-digit={char}
      className={cn('relative inline-block overflow-clip', entering && 'nx-motion', className)}
      {...motion}
    >
      {/* In flow for width/height/baseline; the strip rides over it. */}
      <span className="invisible">0</span>
      <span
        className={cn(
          'absolute inset-x-0 top-0 flex h-[1000%] flex-col text-center',
          'transition-transform duration-spatial-default ease-spatial-default motion-reduce:transition-none',
          SHIFT[Number(char)],
        )}
      >
        {DIGITS.map((d) => (
          <span key={d} className="h-[10%]">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * A rolling number: each digit is a 0–9 strip that slides to its value on the
 * spatial spring; separators, symbols and signs stay static. The first render
 * shows the value as-is; only later changes animate.
 */
export const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  ({ value, format, locale: localeProp, className, 'aria-live': ariaLive = 'off', ...props }, ref) => {
    const locale = useIntlLocale(localeProp);
    const parts: readonly NumberTickerPart[] =
      typeof value === 'number'
        ? [{ value: new Intl.NumberFormat(locale, format).format(value) }]
        : typeof value === 'string'
          ? [{ value }]
          : value;
    const chars = parts.flatMap((p) => Array.from(p.value, (char) => ({ char, className: p.className })));
    const text = parts.map((p) => p.value).join('');

    const mounted = React.useRef(false);
    React.useEffect(() => {
      mounted.current = true;
    }, []);

    return (
      <span
        ref={ref}
        className={cn('whitespace-nowrap tabular-nums', className)}
        aria-live={ariaLive}
        aria-atomic="true"
        {...props}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {chars.map(({ char, className: cls }, i) => {
            // Keyed from the right so the ones digit keeps its strip as the number grows.
            const fromEnd = chars.length - 1 - i;
            const kind = /^[0-9]$/.test(char) ? 'd' : `s${char}`;
            return <Char key={`${fromEnd}${kind}`} char={char} className={cls} enter={mounted.current} />;
          })}
        </span>
      </span>
    );
  },
);
NumberTicker.displayName = 'NumberTicker';
