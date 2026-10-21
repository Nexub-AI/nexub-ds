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
const isDigit = (c: string | undefined) => c !== undefined && /^[0-9]$/.test(c);
// Hebrew/Arabic letters and the RLM/ALM marks Intl puts in RTL-locale formats.
const RTL = /[\u0590-\u08FF\u200F\u061C\uFB1D-\uFDFF\uFE70-\uFEFF]/;

/** Wraps each run of ASCII digits (and the separators between them) in an LTR isolate. */
function digitRuns(items: { char: string; key: string; node: React.ReactNode }[]) {
  const out: React.ReactNode[] = [];
  let run: typeof items = [];
  const flush = () => {
    if (run.length) out.push(<span key={`run${run[run.length - 1]!.key}`} dir="ltr">{run.map((r) => r.node)}</span>);
    run = [];
  };
  items.forEach((it, i) => {
    const inRun = isDigit(it.char) || (run.length > 0 && isDigit(items[i + 1]?.char) && /^[.,\u00A0\u202F' ]$/.test(it.char));
    if (inRun) run.push(it);
    else {
      flush();
      out.push(it.node);
    }
  });
  flush();
  return out;
}

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

    const rendered = chars.map(({ char, className: cls }, i) => {
      // Keyed from the right so the ones digit keeps its strip as the number grows.
      const key = `${chars.length - 1 - i}${isDigit(char) ? 'd' : `s${char}`}`;
      return { char, key, node: <Char key={key} char={char} className={cls} enter={mounted.current} /> };
    });
    const rtlText = RTL.test(text);

    return (
      <span
        ref={ref}
        className={cn('whitespace-nowrap tabular-nums', className)}
        aria-live={ariaLive}
        aria-atomic="true"
        {...props}
      >
        <span className="sr-only">{text}</span>
        {/* Bidi: inline-block digits are neutral to the bidi algorithm, so in an
            RTL context they'd be reversed ("68,420" → "024,86"). Isolate the
            number LTR; text with RTL marks or letters (e.g. 'ar' currency
            formats) keeps RTL order, with each run of digits isolated LTR. */}
        <span aria-hidden="true" dir={rtlText ? 'rtl' : 'ltr'}>
          {rtlText
            ? digitRuns(rendered)
            : rendered.map((r) => r.node)}
        </span>
      </span>
    );
  },
);
NumberTicker.displayName = 'NumberTicker';
