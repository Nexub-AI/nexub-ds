import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { OrgChart, type OrgChartNode } from './OrgChart.js';

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
});
