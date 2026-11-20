import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorState } from '../ErrorState/ErrorState.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';
import { BarChart, DonutChart, Funnel, Heatmap, LineChart, Sparkline, nearestIndex, segmentAt } from './index.js';

const data = [
  { month: 'Jan', a: 10, b: 30 },
  { month: 'Feb', a: 25, b: 5 },
  { month: 'Mar', a: 40, b: 20 },
];
const series = [{ key: 'a', label: 'This year' }, { key: 'b', label: 'Last year' }];
const chart = { title: 'Revenue', data, index: 'month', series } as const;

// jsdom has no layout: every box is 300 × 100 at the origin.
beforeEach(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 300, height: 100, right: 300, bottom: 100, x: 0, y: 0, toJSON: () => ({}) });
});
afterEach(() => vi.restoreAllMocks());

const layer = (name = 'Revenue') => screen.getByRole('group', { name });
const tooltip = () => document.querySelector('[data-chart-tooltip]');
const said = () => document.querySelector('[data-chart-layer] [aria-live="polite"]')!.textContent;
const focus = (el: HTMLElement) => act(() => el.focus());
const key = (el: HTMLElement, k: string) => fireEvent.keyDown(el, { key: k });

describe('chart helpers', () => {
  it('nearestIndex picks the band under x, mirrored in RTL', () => {
    expect([0, 99, 100, 299, 300, -5].map((x) => nearestIndex(x, 300, 3))).toEqual([0, 0, 1, 2, 2, 0]);
    expect([0, 150, 299].map((x) => nearestIndex(x, 300, 3, true))).toEqual([2, 1, 0]);
    expect(nearestIndex(10, 0, 3)).toBe(0);
  });

  it('segmentAt finds the donut segment clockwise from 12, and nothing off the ring', () => {
    const values = [1, 1, 2];
    expect(segmentAt(0.76, 0.24, values)).toBe(0); // 1:30
    expect(segmentAt(0.76, 0.76, values)).toBe(1); // 4:30
    expect(segmentAt(0.12, 0.5, values)).toBe(2); // 9:00
    expect(segmentAt(0.5, 0.5, values)).toBe(-1); // the hole
    expect(segmentAt(0, 0, values)).toBe(-1); // the corner
  });
});

describe('charts stay server-rendered without the opt-in props', () => {
  it('BarChart: the CSS-only overlay, no client layer, the same markup', () => {
    const { container } = render(<BarChart {...chart} data={data.slice(0, 1)} series={series.slice(0, 1)} />);
    expect(container.querySelector('[data-chart-layer]')).toBeNull();
    expect(container.querySelectorAll('.group\\/col')).toHaveLength(1);
    expect(container.querySelector('[data-pt]')).toBeNull();
    expect(container.querySelector('figure > [aria-hidden="true"]')).not.toBeNull();
    expect(container.innerHTML).toMatchInlineSnapshot(`"<figure aria-label="Revenue" class="m-0 flex flex-col gap-3"><div aria-hidden="true" class="flex gap-2"><div class="flex flex-col justify-between text-end text-label-sm tabular-nums text-[var(--color-on-surface-muted)] h-48"><span class="flex h-0 items-center justify-end">10</span><span class="flex h-0 items-center justify-end">7.5</span><span class="flex h-0 items-center justify-end">5</span><span class="flex h-0 items-center justify-end">2.5</span><span class="flex h-0 items-center justify-end">0</span></div><div class="flex min-w-0 flex-1 flex-col gap-1"><div class="relative h-48"><svg viewBox="0 0 300 100" preserveAspectRatio="none" class="size-full overflow-visible rtl:-scale-x-100"><line x1="0" x2="300" y1="0" y2="0" stroke-width="1" vector-effect="non-scaling-stroke" class="stroke-[var(--color-outline-variant)]"></line><line x1="0" x2="300" y1="25" y2="25" stroke-width="1" vector-effect="non-scaling-stroke" class="stroke-[var(--color-outline-variant)]"></line><line x1="0" x2="300" y1="50" y2="50" stroke-width="1" vector-effect="non-scaling-stroke" class="stroke-[var(--color-outline-variant)]"></line><line x1="0" x2="300" y1="75" y2="75" stroke-width="1" vector-effect="non-scaling-stroke" class="stroke-[var(--color-outline-variant)]"></line><line x1="0" x2="300" y1="100" y2="100" stroke-width="1" vector-effect="non-scaling-stroke" class="stroke-[var(--color-outline-variant)]"></line><line x1="0" x2="300" y1="100" y2="100" stroke-width="1" vector-effect="non-scaling-stroke" class="stroke-[var(--color-outline)]"></line><defs><linearGradient id="_r_0_0" x1="0" y1="0" x2="0" y2="1" class="nx-chart-grad nx-chart-grad-1"><stop offset="0"></stop><stop offset="1"></stop></linearGradient></defs><g><rect x="45" y="0" width="209" height="100" fill="url(#_r_0_0)" class="nx-chart-bar"></rect></g></svg><div class="absolute inset-0 grid auto-cols-fr grid-flow-col"><div class="group/col relative rounded-shape-tooltip transition-colors hover:bg-[color-mix(in_oklab,var(--color-on-surface)_6%,transparent)]"><span class="absolute inset-y-0 start-1/2 w-px bg-[var(--color-outline)] opacity-0 transition-opacity group-hover/col:opacity-100"></span><div class="pointer-events-none absolute top-1 z-10 min-w-max rounded-shape-tooltip bg-[var(--color-inverse-surface)] px-3 py-2 text-label-md text-[var(--color-inverse-on-surface)] opacity-0 shadow-elevation-2 transition-opacity group-hover/col:opacity-100 start-0"><div class="mb-1 font-semibold">Jan</div><div class="flex items-center gap-2 tabular-nums"><span class="size-2 shrink-0 rounded-full bg-chart-1"></span><span class="flex-1">This year</span><span class="ps-3">10</span></div></div></div></div></div><div class="grid auto-cols-fr grid-flow-col text-center text-label-sm text-[var(--color-on-surface-muted)]"><span class="truncate px-0.5">Jan</span></div></div></div><table class="sr-only"><caption>Revenue</caption><thead><tr><th scope="col">month</th><th scope="col">This year</th></tr></thead><tbody><tr><th scope="row">Jan</th><td>10</td></tr></tbody></table></figure>"`);
  });

  it('the other charts have no layer either', () => {
    const { container } = render(
      <>
        <LineChart {...chart} />
        <DonutChart title="Plans" data={[{ label: 'Pro', value: 3 }]} />
        <Heatmap title="Activity" data={[[1, 2]]} rowLabels={['Mon']} />
        <Funnel title="Signup" data={[{ label: 'Visit', value: 10 }]} />
        <Sparkline values={[1, 2, 3]} />
      </>,
    );
    expect(container.querySelector('[data-chart-layer], [data-pt], [role="group"]')).toBeNull();
    expect(container.querySelector('svg + svg, figure ~ svg')!.tagName).toBe('svg');
  });

  it('an interactive chart renders on the server with no style attributes (strict CSP)', () => {
    const html = renderToString(<><BarChart {...chart} interactive legend="toggle" /><DonutChart title="D" data={[{ label: 'x', value: 1 }]} interactive /></>);
    expect(html).toContain('data-chart-layer');
    expect(html).not.toContain('style=');
  });
});

describe('interactive BarChart and LineChart', () => {
  it('the pointer snaps to the nearest datum and shows every series; leaving hides it', () => {
    const { container } = render(<LineChart {...chart} interactive valueFormat={(v) => `$${v}`} />);
    expect(container.querySelector('.group\\/col')).toBeNull();
    expect(tooltip()).toBeNull();
    fireEvent.pointerMove(layer(), { clientX: 150, clientY: 40 });
    expect(tooltip()!.getAttribute('aria-live')).toBe('off');
    expect(tooltip()!.textContent).toBe('FebThis year$25Last year$5');
    // Keyboard text is not announced for the pointer.
    expect(said()).toBe('');
    fireEvent.pointerMove(layer(), { clientX: 290, clientY: 40 });
    expect(tooltip()!.textContent).toContain('Mar');
    fireEvent.pointerLeave(layer(), { pointerType: 'mouse' });
    expect(tooltip()).toBeNull();
  });

  it('touch: a tap shows the tooltip and a tap elsewhere dismisses it', () => {
    render(<BarChart {...chart} interactive />);
    fireEvent.pointerDown(layer(), { clientX: 10, clientY: 10, pointerType: 'touch' });
    fireEvent.pointerLeave(layer(), { pointerType: 'touch' });
    expect(tooltip()!.textContent).toContain('Jan');
    fireEvent.pointerDown(document.body);
    expect(tooltip()).toBeNull();
  });

  it('is one tab stop: arrows move between points and series, Home/End jump, Escape hides', () => {
    const { container } = render(<BarChart {...chart} interactive />);
    const el = layer();
    expect(container.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
    focus(el);
    expect(said()).toBe('Jan: This year 10');
    key(el, 'ArrowRight');
    expect(said()).toBe('Feb: This year 25');
    expect(tooltip()!.textContent).toContain('Feb');
    // The focused bar is marked; the other categories step back.
    expect([...container.querySelectorAll('rect')].map((r) => r.getAttribute('data-pt'))).toEqual(['off', 'off', 'focus', 'on', 'off', 'off']);
    key(el, 'ArrowDown');
    expect(said()).toBe('Feb: Last year 5');
    key(el, 'End');
    expect(said()).toBe('Mar: Last year 20');
    key(el, 'ArrowRight');
    expect(said()).toBe('Mar: Last year 20');
    key(el, 'Home');
    key(el, 'ArrowUp');
    expect(said()).toBe('Jan: This year 10');
    key(el, 'Escape');
    expect(tooltip()).toBeNull();
    key(el, 'ArrowRight');
    expect(said()).toBe('Feb: This year 25');
  });

  it('RTL: Left moves forward, and the pointer is mirrored', () => {
    render(<NexubProvider locale="ar" dir="rtl"><BarChart {...chart} interactive /></NexubProvider>);
    const el = layer();
    focus(el);
    key(el, 'ArrowLeft');
    expect(said()).toBe('Feb: This year 25');
    key(el, 'ArrowRight');
    expect(said()).toBe('Jan: This year 10');
    fireEvent.pointerMove(el, { clientX: 290, clientY: 10 });
    expect(tooltip()!.textContent).toContain('Jan');
  });

  it('onPointClick alone turns the layer on and gets the datum, and the series when one is named', () => {
    const onPointClick = vi.fn();
    render(<BarChart {...chart} onPointClick={onPointClick} />);
    const el = layer();
    expect(el.className).toContain('cursor-pointer');
    // Jan's band is 0–100; its second bar is the right half of the middle 70%.
    fireEvent.click(el, { clientX: 60, clientY: 50 });
    expect(onPointClick).toHaveBeenLastCalledWith({ index: 0, datum: data[0], series: series[1], value: 30 });
    focus(el);
    key(el, 'End');
    key(el, 'ArrowUp');
    key(el, 'Enter');
    expect(onPointClick).toHaveBeenLastCalledWith({ index: 2, datum: data[2], series: series[0], value: 40 });
    key(el, ' ');
    expect(onPointClick).toHaveBeenCalledTimes(3);
  });

  it('a line chart click names the datum; the series only when there is one', () => {
    const onPointClick = vi.fn();
    const { rerender } = render(<LineChart {...chart} area onPointClick={onPointClick} />);
    fireEvent.click(layer(), { clientX: 160, clientY: 50 });
    expect(onPointClick).toHaveBeenLastCalledWith({ index: 1, datum: data[1], series: undefined, value: undefined });
    rerender(<LineChart {...chart} series={series.slice(0, 1)} onPointClick={onPointClick} />);
    fireEvent.click(layer(), { clientX: 160, clientY: 50 });
    expect(onPointClick).toHaveBeenLastCalledWith({ index: 1, datum: data[1], series: series[0], value: 25 });
  });

  it('legend="toggle" hides a series, pins colours and keeps one on', () => {
    const onHiddenSeriesChange = vi.fn();
    const { container } = render(<BarChart {...chart} legend="toggle" onHiddenSeriesChange={onHiddenSeriesChange} />);
    // The toggle alone keeps the CSS-only tooltip.
    expect(container.querySelector('[data-chart-layer]')).toBeNull();
    expect(container.querySelectorAll('.group\\/col')).toHaveLength(3);
    const first = screen.getByRole('button', { name: 'This year' });
    expect(first.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(first);
    expect(first.getAttribute('aria-pressed')).toBe('false');
    expect(onHiddenSeriesChange).toHaveBeenLastCalledWith(['a']);
    expect(container.querySelectorAll('rect')).toHaveLength(3);
    expect(container.querySelector('linearGradient')!.getAttribute('class')).toBe('nx-chart-grad nx-chart-grad-2');
    fireEvent.click(screen.getByRole('button', { name: 'Last year' }));
    expect(screen.getByRole('button', { name: 'Last year' }).getAttribute('aria-pressed')).toBe('true');
    expect(onHiddenSeriesChange).toHaveBeenCalledTimes(1);
  });

  it('hiddenSeries controls the toggle, and the tooltip lists the visible series', () => {
    render(<LineChart {...chart} interactive legend="toggle" hiddenSeries={['b']} />);
    expect(screen.getByRole('button', { name: 'Last year' }).getAttribute('aria-pressed')).toBe('false');
    fireEvent.pointerMove(layer(), { clientX: 10, clientY: 10 });
    expect(tooltip()!.textContent).toBe('JanThis year10');
  });

  it('loading and errorState suppress the layer', () => {
    const { container, rerender } = render(<BarChart {...chart} interactive legend="toggle" loading />);
    expect(container.querySelector('[data-chart-layer], [role="group"], button')).toBeNull();
    expect(screen.getByRole('figure', { name: 'Revenue' }).getAttribute('aria-busy')).toBe('true');
    rerender(<BarChart {...chart} interactive errorState={<ErrorState title="Failed" />} />);
    expect(container.querySelector('[data-chart-layer]')).toBeNull();
    rerender(<BarChart {...chart} data={[]} interactive />);
    expect(container.querySelector('[data-chart-layer]')).toBeNull();
    rerender(<DonutChart title="Revenue" data={[]} interactive loading />);
    expect(container.querySelector('[data-chart-layer]')).toBeNull();
  });
});

describe('the other interactive charts', () => {
  it('DonutChart: segment tooltip with the share, Left/Right, click', () => {
    const plans = [{ label: 'Pro', value: 3 }, { label: 'Free', value: 1 }];
    const onPointClick = vi.fn();
    const { container } = render(<DonutChart title="Plans" data={plans} onPointClick={onPointClick} />);
    const el = layer('Plans');
    // 300 × 100 box: (270, 50) is 3 o'clock on the ring, inside Pro's 75%.
    fireEvent.pointerMove(el, { clientX: 264, clientY: 50 });
    expect(tooltip()!.textContent).toBe('Pro3 (75%)');
    expect([...container.querySelectorAll('circle[data-pt]')].map((c) => c.getAttribute('data-pt'))).toEqual(['on', 'off']);
    fireEvent.pointerMove(el, { clientX: 150, clientY: 50 });
    expect(tooltip()).toBeNull();
    focus(el);
    key(el, 'ArrowRight');
    expect(said()).toBe('Free: 1 (25%)');
    key(el, 'Enter');
    expect(onPointClick).toHaveBeenLastCalledWith({ index: 1, datum: plans[1], value: 1 });
  });

  it('Heatmap: cell tooltip, arrows across the grid, click', () => {
    const onPointClick = vi.fn();
    render(<Heatmap title="Activity" data={[[1, 2, 3], [4, 5, 6]]} rowLabels={['Mon', 'Tue']} columnLabels={['W1', 'W2', 'W3']} onPointClick={onPointClick} />);
    const el = layer('Activity');
    fireEvent.pointerMove(el, { clientX: 250, clientY: 75 });
    expect(tooltip()!.textContent).toBe('Tue, W36');
    fireEvent.click(el, { clientX: 110, clientY: 10 });
    expect(onPointClick).toHaveBeenLastCalledWith({ index: 1, row: 0, column: 1, value: 2 });
    key(el, 'ArrowDown');
    expect(said()).toBe('Tue, W2: 5');
    key(el, 'ArrowRight');
    key(el, 'ArrowRight');
    expect(said()).toBe('Tue, W3: 6');
    key(el, 'Home');
    expect(said()).toBe('Tue, W1: 4');
    key(el, 'ArrowUp');
    key(el, 'ArrowUp');
    expect(said()).toBe('Mon, W1: 1');
  });

  it('Funnel: step tooltip, Up/Down, click', () => {
    const steps = [{ label: 'Visit', value: 200 }, { label: 'Signup', value: 50 }];
    const onPointClick = vi.fn();
    render(<Funnel title="Signup funnel" data={steps} onPointClick={onPointClick} />);
    const el = layer('Signup funnel');
    fireEvent.pointerMove(el, { clientX: 20, clientY: 80 });
    expect(tooltip()!.textContent).toBe('Signup50 (25%)');
    focus(el);
    key(el, 'ArrowUp');
    expect(said()).toBe('Visit: 200 (100%)');
    key(el, 'ArrowRight');
    expect(said()).toBe('Visit: 200 (100%)');
    key(el, 'ArrowDown');
    key(el, 'Enter');
    expect(onPointClick).toHaveBeenLastCalledWith({ index: 1, datum: steps[1], value: 50 });
  });

  it('Sparkline: the nearest value, Left/Right, and the label on the layer', () => {
    const onPointClick = vi.fn();
    const { container } = render(<Sparkline values={[1, 3, 2]} label="Revenue trend" interactive onPointClick={onPointClick} />);
    const el = layer('Revenue trend');
    expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
    fireEvent.pointerMove(el, { clientX: 140, clientY: 10 });
    expect(tooltip()!.textContent).toBe('3');
    key(el, 'ArrowRight');
    expect(said()).toBe('Revenue trend: 2');
    fireEvent.click(el, { clientX: 5, clientY: 10 });
    expect(onPointClick).toHaveBeenLastCalledWith({ index: 0, datum: 1, value: 1 });
  });
});
