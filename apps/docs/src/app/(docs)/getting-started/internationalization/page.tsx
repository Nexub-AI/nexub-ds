import type { Metadata } from 'next';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Internationalization' };

// Mirrors defaultMessages in packages/core/src/messages.ts (shared by @nexub/react and @nexub/react-native).
const messageKeys: [key: string, value: string][] = [
  ['close', "'Close'"],
  ['dismissAlert', "'Dismiss alert'"],
  ['dismissBanner', "'Dismiss banner'"],
  ['remove', "'Remove'"],
  ['removeFilter', "'Remove filter'"],
  ['removeFile', '(fileName) => `Remove ${fileName}`'],
  ['uploadFiles', "'Upload files'"],
  ['clickToUpload', "'Click to upload'"],
  ['orDragAndDrop', "'or drag and drop'"],
  ['clearSearch', "'Clear search'"],
  ['showPassword', "'Show password'"],
  ['hidePassword', "'Hide password'"],
  ['increment', "'Increment'"],
  ['decrement', "'Decrement'"],
  ['loading', "'Loading…'"],
  ['pagination', "'Pagination'"],
  ['previousPage', "'Go to previous page'"],
  ['nextPage', "'Go to next page'"],
  ['goToPage', '(page) => `Go to page ${page}`'],
  ['breadcrumb', "'breadcrumb'"],
  ['breadcrumbMore', "'More'"],
  ['moreCount', '(count) => `${count} more`'],
  ['rating', "'Rating'"],
  ['ratingStars', '(stars) => `${stars} star(s)`'],
  ['mainNavigation', "'Main'"],
  ['sidebar', "'Sidebar'"],
  ['searchPlaceholder', "'Search…'"],
  ['noResults', "'No results found.'"],
  ['pickDate', "'Pick a date'"],
  ['pickDateRange', "'Pick a date range'"],
  ['commandPalette', "'Command palette'"],
  ['notifications', "'Notifications ({hotkey})' — Radix replaces {hotkey}"],
  ['undo', "'Undo'"],
  // AI surfaces — see /getting-started/ai-surfaces
  ['promptLabel', "'Message'"],
  ['sendMessage', "'Send message'"],
  ['stopGenerating', "'Stop generating'"],
  ['promptHint', "'Press Enter to send, Shift+Enter for a new line'"],
  ['thinking', "'Thinking'"],
  ['youSaid', "'You said'"],
  ['assistantSaid', "'Assistant said'"],
  ['failedToSend', "'Failed to send'"],
  ['retry', "'Retry'"],
  ['copy', "'Copy'"],
  ['copied', "'Copied'"],
  ['goodResponse', "'Good response'"],
  ['badResponse', "'Bad response'"],
  ['regenerate', "'Regenerate'"],
  ['sources', "'Sources'"],
  ['source', '(n) => `Source ${n}`'],
  ['jumpToLatest', "'Jump to latest'"],
  ['conversation', "'Conversation'"],
];

export default function InternationalizationPage() {
  return (
    <div className="docs-prose">
      <p className="text-[0.8rem] font-semibold text-[var(--color-primary)] tracking-wider uppercase mb-2">
        Getting Started
      </p>
      <h1>Internationalization</h1>
      <p>
        <code>NexubProvider</code> sets the locale, text direction and built-in strings for every{' '}
        <code>@nexub/react</code> component. It is optional: without it, components use English strings,
        left-to-right layout and the user’s own locale for number and date formatting.
      </p>

      <h2>NexubProvider</h2>
      <CodeBlock code={`import { NexubProvider, type NexubMessages } from '@nexub/react';

const ar: Partial<NexubMessages> = {
  close: 'إغلاق',
  undo: 'تراجع',
  goToPage: (page) => \`الانتقال إلى الصفحة \${page}\`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <NexubProvider locale="ar" messages={ar}>
          {children}
        </NexubProvider>
      </body>
    </html>
  );
}`} />
      <table>
        <thead>
          <tr><th>Prop</th><th>Default</th><th>What it does</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>locale</code></td>
            <td><code>&apos;en&apos;</code></td>
            <td>BCP 47 locale for <code>Intl</code> formatting in <code>Amount</code>, <code>MoneyInput</code>, <code>NumberTicker</code>, <code>DatePicker</code> and <code>DateRangePicker</code>. The <code>locale</code> prop on Amount, MoneyInput and NumberTicker still wins.</td>
          </tr>
          <tr>
            <td><code>dir</code></td>
            <td>from <code>locale</code></td>
            <td><code>&apos;rtl&apos;</code> for Arabic, Hebrew, Persian and Urdu (<code>ar</code>, <code>he</code>, <code>fa</code>, <code>ur</code>, with any region), otherwise <code>&apos;ltr&apos;</code>. Set it to override.</td>
          </tr>
          <tr>
            <td><code>dateLocale</code></td>
            <td>none</td>
            <td>A date-fns <code>Locale</code> (e.g. <code>import {'{ fr }'} from &apos;date-fns/locale&apos;</code>) for the date pickers: month and weekday names, week start and the trigger&apos;s date format. Only the locale you import is bundled. A picker&apos;s own <code>locale</code> prop wins.</td>
          </tr>
          <tr>
            <td><code>messages</code></td>
            <td>English</td>
            <td>A <code>Partial&lt;NexubMessages&gt;</code> merged over the defaults, so you only pass what you translate. Explicit props still win: <code>&lt;Autocomplete placeholder=&quot;…&quot; /&gt;</code> beats <code>searchPlaceholder</code>.</td>
          </tr>
        </tbody>
      </table>
      <p>
        The provider wraps Radix’s <code>DirectionProvider</code>, so menus, sliders, tabs and other Radix
        primitives follow <code>dir</code> for keyboard arrows and placement. It does not touch{' '}
        <code>&lt;html&gt;</code>: set <code>lang</code> and <code>dir</code> there yourself, where your app
        renders it, so the page, screen readers and the CSS <code>rtl:</code> variants agree with the provider.
      </p>
      <p>
        <code>useLocale()</code> returns the active <code>{'{ locale, dir }'}</code>, and{' '}
        <code>useNexubMessages()</code> the merged strings, for your own components.
      </p>

      <h2>Right-to-left</h2>
      <p>
        Components use logical properties (<code>ms-</code>, <code>pe-</code>, <code>start</code>,{' '}
        <code>border-s</code>), so padding, borders and alignment flip with <code>dir</code>. Directional icons,
        such as the chevrons in Pagination, Breadcrumb and menus, mirror under <code>dir=&quot;rtl&quot;</code>;
        the Switch thumb and Toast slide-in reverse too.
      </p>
      <p>
        Drawer’s <code>side</code> stays physical: <code>side=&quot;left&quot;</code> is the left edge in both
        directions. Pick the side from <code>dir</code> if you want the drawer to follow reading order.
      </p>

      <h2>Message keys</h2>
      <p>
        Every user-facing default string in <code>@nexub/react</code>. Function keys take a value and return
        the string, so plurals and word order can follow the language.
      </p>
      <table>
        <thead>
          <tr><th>Key</th><th>Default</th></tr>
        </thead>
        <tbody>
          {messageKeys.map(([key, value]) => (
            <tr key={key}>
              <td><code>{key}</code></td>
              <td><code>{value}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
