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
