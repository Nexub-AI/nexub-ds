import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DescriptionList } from './DescriptionList.js';

describe('DescriptionList', () => {
  it('pairs each term with its definition inside a dl', () => {
    const { container } = render(
      <DescriptionList.Root aria-label="Order">
        <DescriptionList.Item label="Subtotal" helpText="2 items">$40.00</DescriptionList.Item>
        <DescriptionList.Item label="Shipping">$5.00</DescriptionList.Item>
      </DescriptionList.Root>,
    );
    const dl = container.querySelector('dl')!;
    expect(dl.getAttribute('aria-label')).toBe('Order');
    const terms = screen.getAllByRole('term');
    const definitions = screen.getAllByRole('definition');
    expect(terms.map((t) => t.textContent)).toEqual(['Subtotal2 items', 'Shipping']);
    expect(definitions.map((d) => d.textContent)).toEqual(['$40.00', '$5.00']);
    terms.forEach((t, i) => {
      expect(t.tagName).toBe('DT');
      expect(t.parentElement).toBe(definitions[i]!.parentElement);
      expect(t.parentElement!.parentElement).toBe(dl);
    });
    expect(definitions[0]!.className).toContain('tabular-nums');
  });

  it('marks a total with emphasis: stronger weight and a rule above', () => {
    render(
      <DescriptionList.Root>
        <DescriptionList.Item label="Shipping">$5.00</DescriptionList.Item>
        <DescriptionList.Item label="Total" emphasis>$45.00</DescriptionList.Item>
      </DescriptionList.Root>,
    );
    const total = screen.getByText('Total').parentElement!;
    expect(total.getAttribute('data-emphasis')).toBe('true');
    expect(total.className).toContain('font-semibold');
    expect(total.className).toContain('border-t');
    const plain = screen.getByText('Shipping').parentElement!;
    expect(plain.hasAttribute('data-emphasis')).toBe(false);
    expect(plain.className).not.toContain('border-t');
  });

  it('sets layout, size, columns and dividers on the list; align on the value', () => {
    const { container, rerender } = render(
      <DescriptionList.Root>
        <DescriptionList.Item label="Plan">Pro</DescriptionList.Item>
      </DescriptionList.Root>,
    );
    let dl = container.querySelector('dl')!;
    expect(dl.getAttribute('data-layout')).toBe('inline');
    expect(dl.getAttribute('data-size')).toBe('md');
    expect(dl.parentElement!.className).toContain('@container');
    expect(dl.className).not.toContain('border-b');
    expect(screen.getByRole('definition').className).toContain('text-end');

    rerender(
      <DescriptionList.Root layout="stacked" size="sm" columns={3} divided>
        <DescriptionList.Item label="Plan" align="start">Pro</DescriptionList.Item>
      </DescriptionList.Root>,
    );
    dl = container.querySelector('dl')!;
    expect(dl.getAttribute('data-layout')).toBe('stacked');
    expect(dl.getAttribute('data-size')).toBe('sm');
    expect(dl.className).toContain('@md:grid-cols-2');
    expect(dl.className).toContain('@3xl:grid-cols-3');
    expect(dl.className).toContain('[&>div]:border-b');
    expect(screen.getByRole('definition').className).toContain('text-start');
    expect(screen.getByRole('definition').className).not.toContain('text-end');
  });
});
