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
