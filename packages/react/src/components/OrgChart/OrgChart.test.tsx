import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { OrgChart, type OrgChartNode } from './OrgChart.js';
import { clampZoom } from './ZoomFrame.js';

const people: OrgChartNode[] = [
  {
    id: 'ceo',
    label: 'Ada Lovelace',
    description: 'CEO',
    children: [
      { id: 'cto', label: 'Alan Turing', description: 'CTO', children: [{ id: 'eng', label: 'Grace Hopper', description: 'Engineer' }] },
      { id: 'cfo', label: 'Mary Somerville', description: 'CFO' },
    ],
  },
];

const item = (name: string) => screen.getByRole('treeitem', { name: new RegExp(`^${name}`) });

const original = window.matchMedia;
const setWidth = (narrow: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: narrow,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
};
afterEach(() => {
  window.matchMedia = original;
});

describe('OrgChart', () => {
  it('is a tree of named cards with levels; arrows follow the tree pattern', async () => {
    setWidth(false);
    render(<OrgChart aria-label="Company" nodes={people} />);
    expect(screen.getByRole('tree', { name: 'Company' })).toBeInTheDocument();
    expect(item('Ada Lovelace CEO')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('2 reports')).toBeInTheDocument();
    await userEvent.tab();
    expect(item('Ada')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(item('Ada')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(item('Alan Turing CTO')).toHaveFocus();
    expect(item('Alan')).toHaveAttribute('aria-level', '2');
    await userEvent.keyboard('{ArrowDown}');
    expect(item('Mary')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(item('Ada')).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(item('Mary')).toHaveFocus();
    await userEvent.keyboard('{Home}{ArrowLeft}');
    expect(screen.queryByRole('treeitem', { name: /^Mary/ })).toBeNull();
  });

  it('Enter and click activate; the reports control and Space toggle', async () => {
    setWidth(false);
    const onActivate = vi.fn();
    const onExpandedChange = vi.fn();
    render(<OrgChart aria-label="Company" nodes={people} onActivate={onActivate} onExpandedChange={onExpandedChange} />);
    await userEvent.click(screen.getByText('2 reports'));
    expect(onExpandedChange).toHaveBeenLastCalledWith(['ceo']);
    expect(onActivate).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText('Mary Somerville'));
    expect(onActivate).toHaveBeenLastCalledWith(people[0]!.children![1]);
    expect(item('Mary')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{Enter}');
    expect(onActivate).toHaveBeenLastCalledWith(people[0]!.children![0]);
    await userEvent.keyboard(' ');
    expect(onExpandedChange).toHaveBeenLastCalledWith(['ceo', 'cto']);
  });

  it('renderCard replaces the card content and names the item', () => {
    setWidth(false);
    render(<OrgChart aria-label="Company" nodes={people} renderCard={(n) => <strong>{n.label} (custom)</strong>} />);
    expect(screen.getByRole('treeitem', { name: 'Ada Lovelace (custom)' })).toBeInTheDocument();
  });

  it('renders a TreeView on narrow screens with the same expanded state', async () => {
    setWidth(true);
    const onActivate = vi.fn();
    render(<OrgChart aria-label="Company" nodes={people} defaultExpanded={['ceo']} onActivate={onActivate} />);
    expect(screen.queryByText('2 reports')).toBeNull();
    expect(item('Ada Lovelace')).toHaveAttribute('aria-expanded', 'true');
    item('Mary').focus();
    await userEvent.keyboard('{Enter}');
    expect(onActivate).toHaveBeenCalledWith(people[0]!.children![1]);
  });

  it('has no axe violations', async () => {
    setWidth(false);
    const { container } = render(<OrgChart aria-label="Company" nodes={people} defaultExpanded={['ceo', 'cto']} />);
    const { violations } = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(violations).toEqual([]);
  });

  describe('zoom', () => {
    const level = () => screen.getByRole('group', { name: 'Zoom' }).querySelector('output')!;

    it('is off by default: no toolbar', () => {
      setWidth(false);
      render(<OrgChart aria-label="Company" nodes={people} />);
      expect(screen.queryByRole('group', { name: 'Zoom' })).toBeNull();
      expect(screen.queryByRole('button', { name: 'Zoom in' })).toBeNull();
    });

    it('clamps to 0.25–2 and to minZoom/maxZoom', () => {
      expect(clampZoom(5)).toBe(2);
      expect(clampZoom(0.1)).toBe(0.25);
      expect(clampZoom(1.3)).toBe(1.3);
      expect(clampZoom(Number.NaN)).toBe(1);
      expect(clampZoom(0.3, 0.5, 1.5)).toBe(0.5);
      expect(clampZoom(1.8, 0.5, 1.5)).toBe(1.5);
      expect(clampZoom(3, 0.1, 4)).toBe(2);
      setWidth(false);
      render(<OrgChart aria-label="Company" nodes={people} zoomable zoom={9} />);
      expect(level()).toHaveTextContent('200%');
      expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
    });

    it('buttons step the zoom, announce the level and stop at the limits', async () => {
      setWidth(false);
      const onZoomChange = vi.fn();
      render(<OrgChart aria-label="Company" nodes={people} zoomable minZoom={0.75} maxZoom={1.25} onZoomChange={onZoomChange} />);
      expect(level()).toHaveTextContent('100%');
      expect(level()).toHaveAttribute('aria-live', 'polite');
      await userEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
      expect(onZoomChange).toHaveBeenLastCalledWith(1.1);
      expect(level()).toHaveTextContent('110%');
      await userEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
      expect(level()).toHaveTextContent('125%');
      expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
      await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
      await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
      await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
      expect(level()).toHaveTextContent('90%');
      await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
      expect(level()).toHaveTextContent('75%');
      expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled();
      // jsdom has no layout, so fit falls back to 100%.
      await userEvent.click(screen.getByRole('button', { name: 'Fit to screen' }));
      expect(level()).toHaveTextContent('100%');
    });

    it('+ / = / - / 0 zoom while a card has focus; the tree keys still work', async () => {
      setWidth(false);
      render(<OrgChart aria-label="Company" nodes={people} zoomable defaultZoom={1} />);
      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();
      expect(item('Ada')).toHaveFocus();
      await userEvent.keyboard('+');
      expect(level()).toHaveTextContent('110%');
      await userEvent.keyboard('=');
      expect(level()).toHaveTextContent('125%');
      await userEvent.keyboard('0');
      expect(level()).toHaveTextContent('100%');
      await userEvent.keyboard('-');
      expect(level()).toHaveTextContent('90%');
      // Modified keys are the browser's (page zoom), not ours.
      await userEvent.keyboard('{Control>}-{/Control}');
      expect(level()).toHaveTextContent('90%');
      await userEvent.keyboard('{ArrowRight}{ArrowRight}');
      expect(item('Alan')).toHaveFocus();
      expect(level()).toHaveTextContent('90%');
    });

    it('ctrl + wheel zooms; a plain wheel does not', () => {
      setWidth(false);
      const { container } = render(<OrgChart aria-label="Company" nodes={people} zoomable />);
      const viewport = container.querySelector('[data-nx-zoom]')!;
      fireEvent.wheel(viewport, { deltaY: -100 });
      expect(level()).toHaveTextContent('100%');
      const e = new WheelEvent('wheel', { deltaY: -50, ctrlKey: true, bubbles: true, cancelable: true });
      fireEvent(viewport, e);
      expect(e.defaultPrevented).toBe(true);
      expect(level()).toHaveTextContent('128%');
    });

    it('keeps the tree ARIA and axe-clean with zoom on', async () => {
      setWidth(false);
      const { container } = render(<OrgChart aria-label="Company" nodes={people} zoomable defaultExpanded={['ceo']} />);
      expect(screen.getByRole('tree', { name: 'Company' })).toBeInTheDocument();
      expect(item('Alan')).toHaveAttribute('aria-level', '2');
      const { violations } = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
      expect(violations).toEqual([]);
    });
  });

  describe('stackAbove', () => {
    const wide: OrgChartNode[] = [
      {
        id: 'lead',
        label: 'Lead',
        children: Array.from({ length: 5 }, (_, i) => ({ id: `r${i}`, label: `Report ${i + 1}`, children: i === 0 ? [{ id: 'x', label: 'Deep' }] : undefined })),
      },
    ];
    const group = () => item('Lead').querySelector('[role="group"]')!;

    it('stacks only past the threshold', () => {
      setWidth(false);
      const { unmount } = render(<OrgChart aria-label="Team" nodes={wide} defaultExpanded={['lead']} stackAbove={5} />);
      expect(group()).not.toHaveAttribute('data-stacked');
      unmount();
      render(<OrgChart aria-label="Team" nodes={wide} defaultExpanded={['lead']} stackAbove={4} />);
      expect(group()).toHaveAttribute('data-stacked');
    });

    it('keeps levels, set sizes and positions, and arrows follow the tree', async () => {
      setWidth(false);
      render(<OrgChart aria-label="Team" nodes={wide} defaultExpanded={['lead', 'r0']} stackAbove={2} />);
      const third = item('Report 3');
      expect(third).toHaveAttribute('aria-level', '2');
      expect(third).toHaveAttribute('aria-setsize', '5');
      expect(third).toHaveAttribute('aria-posinset', '3');
      expect(item('Deep')).toHaveAttribute('aria-level', '3');
      await userEvent.tab();
      await userEvent.keyboard('{ArrowDown}');
      expect(item('Report 1')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(item('Deep')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(item('Report 2')).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(item('Lead')).toHaveFocus();
    });
  });
});
