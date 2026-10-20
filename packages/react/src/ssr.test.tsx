// @vitest-environment node
// SSR smoke test: no window/document. Catches module-level browser access and
// render-time browser access that breaks Next.js server rendering.
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import * as N from './index.js';

const cases: [string, React.ReactElement][] = [
  ['Button', <N.Button>Save</N.Button>],
  ['Input', <N.Input placeholder="x" />],
  ['Textarea', <N.Textarea />],
  ['NumberInput', <N.NumberInput showSteppers />],
  ['SearchInput', <N.SearchInput />],
  ['PasswordInput', <N.PasswordInput />],
  ['Badge', <N.Badge>New</N.Badge>],
  ['Avatar', <N.Avatar name="Ada Lovelace" />],
  ['Card', <N.Card>c</N.Card>],
  ['Alert', <N.Alert>a</N.Alert>],
  ['Spinner', <N.Spinner />],
  ['Progress', <N.Progress value={40} />],
  ['Rating', <N.Rating value={3} />],
  ['Slider', <N.Slider defaultValue={[20]} aria-label="v" />],
  ['Switch', <N.Switch />],
  ['Checkbox', <N.Checkbox />],
  ['Link', <N.Link href="/x">x</N.Link>],
  ['Fade', <N.Fade in>x</N.Fade>],
  ['Collapse', <N.Collapse in>x</N.Collapse>],
  ['DatePicker', <N.DatePicker />],
  ['Autocomplete', <N.Autocomplete options={[{ value: 'a', label: 'A' }]} />],
  ['Tooltip', (
    <N.TooltipProvider>
      <N.Tooltip label="Hint"><button type="button">t</button></N.Tooltip>
    </N.TooltipProvider>
  )],
  ['Sidebar', <N.Sidebar.Root><N.Sidebar.Item href="#">Home</N.Sidebar.Item></N.Sidebar.Root>],
  ['TopNav', <N.TopNav.Root><N.TopNav.Menu><N.TopNav.Item href="#">Docs</N.TopNav.Item></N.TopNav.Menu></N.TopNav.Root>],
  ['Toaster', <N.Toaster />],
];

describe('SSR', () => {
  it('imports without touching browser globals', () => {
    expect(typeof window).toBe('undefined');
    expect(Object.keys(N).length).toBeGreaterThan(90);
  });

  it.each(cases)('%s renders to string', (_name, el) => {
    expect(() => renderToString(<N.ThemeProvider>{el}</N.ThemeProvider>)).not.toThrow();
  });
});

// Strict CSP (style-src without 'unsafe-inline') blocks style attributes in
// server HTML. Scale values must render as classes. Allowlist is shrink-only:
// Fade/Collapse animate via inline style (degrade to no first-paint animation);
// the rest are Radix internals (library-owned): Slider thumb position, the
// hidden form input behind Switch/Checkbox, Popover anchor (Autocomplete), and
// Toast's visually-hidden announcer.
const STYLE_ALLOWED = new Set(['Fade', 'Collapse', 'Slider', 'Switch', 'Checkbox', 'Autocomplete', 'Toaster', 'RadioCard', 'CheckboxCard']);

const cspCases: [string, React.ReactElement][] = [
  ['Stack', <N.Stack gap={4} align="center" justify="between">x</N.Stack>],
  ['Flex', <N.Flex gap={2} align="start">x</N.Flex>],
  ['Grid', <N.Grid cols={3} rows={2} gap={6}>x</N.Grid>],
  ['Text', <N.Text lineClamp={2}>x</N.Text>],
  ['Heading', <N.Heading tone="success">x</N.Heading>],
  ['Label', <N.Label tone="danger">x</N.Label>],
  ['HelperText', <N.HelperText tone="warning">x</N.HelperText>],
  ['Skeleton', <N.Skeleton />],
  ['Skeleton circle', <N.Skeleton shape="circle" />],
  ['AspectRatio', <N.AspectRatio ratio={4 / 3}>x</N.AspectRatio>],
  ['GradientDivider', <N.GradientDivider orientation="vertical" />],
  ['Textarea autoGrow', <N.Textarea autoGrow />],
  ['NumberTicker', <N.NumberTicker value={1234.5} locale="en-US" />],
  ['RadioCard', <N.RadioCardGroup defaultValue="a"><N.RadioCard value="a" title="A" /></N.RadioCardGroup>],
  ['CheckboxCard', <N.CheckboxCard title="A" />],
  ['MediaCard', <N.MediaCard src="/a.jpg" alt="" title="T" href="/x" />],
];

describe('strict CSP: no style attributes in server HTML', () => {
  it.each([...cases, ...cspCases].filter(([n]) => !STYLE_ALLOWED.has(n)))('%s', (_name, el) => {
    expect(renderToString(<N.ThemeProvider>{el}</N.ThemeProvider>)).not.toMatch(/ style="/);
  });
});
