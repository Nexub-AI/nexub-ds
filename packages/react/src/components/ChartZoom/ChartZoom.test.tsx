import { render as renderState, screen as stateScreen } from '@testing-library/react';
import { ChartZoom as StateZoom } from './ChartZoom.js';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { ChartZoom } from './ChartZoom.js';

const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({ month, value: i }));

describe('ChartZoom', () => {
  it('slices the data with the thumbs and resets', async () => {
    render(
      <ChartZoom data={data} index="month" defaultRange={[1, 3]}>
        {(slice) => <p>{slice.map((d) => d.month).join(' ')}</p>}
      </ChartZoom>,
    );
    expect(screen.getByText('Feb Mar Apr')).toBeInTheDocument();
    const start = screen.getByRole('slider', { name: 'Zoom start: Feb' });
    start.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByText('Jan Feb Mar Apr')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reset zoom' }));
    expect(screen.getByText('Jan Feb Mar Apr May Jun')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset zoom' })).toBeDisabled();
  });
});

describe('ChartZoom 10.5: data states', () => {
  const rows = ['Jan', 'Feb', 'Mar'].map((month) => ({ month }));

  it('hands the states to the chart and disables the controls while loading or failed', () => {
    const seen: object[] = [];
    const child = (_: unknown, state: object) => {
      seen.push(state);
      return null;
    };
    const { container, rerender } = renderState(<StateZoom data={rows} index="month" defaultRange={[0, 1]} loading>{child}</StateZoom>);
    expect(seen.at(-1)).toMatchObject({ loading: true });
    expect(container.firstElementChild!.getAttribute('aria-busy')).toBe('true');
    expect((stateScreen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    rerender(<StateZoom data={rows} index="month" defaultRange={[0, 1]} loading errorState="Failed">{child}</StateZoom>);
    expect(seen.at(-1)).toMatchObject({ errorState: 'Failed' });
    expect(container.firstElementChild!.hasAttribute('aria-busy')).toBe(false);
    expect((stateScreen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    rerender(<StateZoom data={rows} index="month" defaultRange={[0, 1]}>{child}</StateZoom>);
    expect((stateScreen.getByRole('button') as HTMLButtonElement).disabled).toBe(false);
  });
});
