import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { ResizablePanels } from './ResizablePanels.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

const Two = (props: Partial<React.ComponentProps<typeof ResizablePanels>>) => (
  <ResizablePanels {...props}>
    <div>Left</div>
    <div>Right</div>
  </ResizablePanels>
);
const sep = () => screen.getByRole('separator');

afterEach(() => vi.restoreAllMocks());

describe('ResizablePanels', () => {
  it('a focusable, labelled window splitter between each pair of panels', () => {
    render(
      <ResizablePanels>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </ResizablePanels>,
    );
    const seps = screen.getAllByRole('separator', { name: 'Resize panels' });
    expect(seps).toHaveLength(2);
    expect(seps[0]).toHaveAttribute('tabindex', '0');
    expect(seps[0]).toHaveAttribute('aria-orientation', 'vertical');
    expect(seps[0]).toHaveAttribute('aria-valuenow', '33');
    expect(document.getElementById(seps[0]!.getAttribute('aria-controls')!)).toHaveTextContent('A');
  });

  it('arrow keys move by 5%, Home/End go to the limits, Enter resets', async () => {
    const onSizesChange = vi.fn();
    render(<Two defaultSizes={[60, 40]} onSizesChange={onSizesChange} handleLabel="Resize sidebar" />);
    expect(sep()).toHaveAccessibleName('Resize sidebar');
    sep().focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onSizesChange).toHaveBeenLastCalledWith([65, 35]);
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(onSizesChange).toHaveBeenLastCalledWith([55, 45]);
    await userEvent.keyboard('{Home}');
    expect(onSizesChange).toHaveBeenLastCalledWith([10, 90]);
    await userEvent.keyboard('{End}');
    expect(onSizesChange).toHaveBeenLastCalledWith([90, 10]);
    expect(sep()).toHaveAttribute('aria-valuenow', '90');
    expect(sep()).toHaveAttribute('aria-valuemax', '90');
    await userEvent.keyboard('{Enter}');
    expect(onSizesChange).toHaveBeenLastCalledWith([60, 40]);
  });

  it('minSizes clamp both sides of the pair', async () => {
    const onSizesChange = vi.fn();
    render(<Two minSizes={[30, 40]} onSizesChange={onSizesChange} />);
    sep().focus();
    await userEvent.keyboard('{Home}');
    expect(onSizesChange).toHaveBeenLastCalledWith([30, 70]);
    await userEvent.keyboard('{End}');
    expect(onSizesChange).toHaveBeenLastCalledWith([60, 40]);
    expect(sep()).toHaveAttribute('aria-valuemin', '30');
  });

  it('vertical uses Up/Down; RTL mirrors Left/Right', async () => {
    const onSizesChange = vi.fn();
    const { unmount } = render(<Two direction="vertical" onSizesChange={onSizesChange} />);
    expect(sep()).toHaveAttribute('aria-orientation', 'horizontal');
    sep().focus();
    await userEvent.keyboard('{ArrowRight}{ArrowDown}');
    expect(onSizesChange).toHaveBeenCalledTimes(1);
    expect(onSizesChange).toHaveBeenLastCalledWith([55, 45]);
    unmount();
    onSizesChange.mockClear();
    render(<NexubProvider locale="ar"><Two onSizesChange={onSizesChange} /></NexubProvider>);
    sep().focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onSizesChange).toHaveBeenLastCalledWith([55, 45]);
  });

  it('controlled: sizes come from the prop', async () => {
    const onSizesChange = vi.fn();
    render(<Two sizes={[30, 70]} onSizesChange={onSizesChange} />);
    sep().focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onSizesChange).toHaveBeenLastCalledWith([35, 65]);
    expect(sep()).toHaveAttribute('aria-valuenow', '30');
  });

  it('dragging the separator resizes by pointer distance', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 400, height: 400 } as DOMRect);
    const onSizesChange = vi.fn();
    render(<Two onSizesChange={onSizesChange} />);
    fireEvent.pointerDown(sep(), { clientX: 200, clientY: 0 });
    fireEvent.pointerMove(window, { clientX: 300, clientY: 0 });
    expect(onSizesChange).toHaveBeenLastCalledWith([75, 25]);
    fireEvent.pointerUp(window);
    fireEvent.pointerMove(window, { clientX: 0, clientY: 0 });
    expect(onSizesChange).toHaveBeenCalledTimes(1);
  });
});
