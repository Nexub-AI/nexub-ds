import { describe, it, expect } from 'vitest';
import { moveIndex, rankOptions } from './optionWindow.js';

describe('optionWindow', () => {
  const none = () => false;
  it('moveIndex: arrows, Home, End and pages, clamped', () => {
    expect(moveIndex('ArrowDown', -1, 5, none)).toBe(0);
    expect(moveIndex('ArrowDown', 4, 5, none)).toBe(4);
    expect(moveIndex('ArrowUp', 0, 5, none)).toBe(0);
    expect(moveIndex('End', 0, 5, none)).toBe(4);
    expect(moveIndex('Home', 3, 5, none)).toBe(0);
    expect(moveIndex('PageDown', 0, 20, none)).toBe(8);
    expect(moveIndex('PageUp', 3, 20, none)).toBe(0);
    expect(moveIndex('Enter', 0, 5, none)).toBeNull();
    expect(moveIndex('ArrowDown', 0, 0, none)).toBeNull();
  });
  it('moveIndex: skips disabled rows and headings, either way', () => {
    const off = (i: number) => i === 1 || i === 4;
    expect(moveIndex('ArrowDown', 0, 5, off)).toBe(2);
    expect(moveIndex('End', 0, 5, off)).toBe(3);
    expect(moveIndex('ArrowUp', 2, 5, off)).toBe(0);
  });
  it('moveIndex: loop wraps past the ends and over a leading heading', () => {
    const heading0 = (i: number) => i === 0;
    expect(moveIndex('ArrowUp', 1, 5, heading0, { loop: true })).toBe(4);
    expect(moveIndex('ArrowDown', 4, 5, heading0, { loop: true })).toBe(1);
    expect(moveIndex('ArrowDown', 1, 2, () => true, { loop: true })).toBeNull();
  });
  it('rankOptions: cmdk ranking, original order on ties, everything for an empty search', () => {
    const items = ['Banana', 'Apple', 'Pineapple', 'Grape'];
    expect(rankOptions(items, '', (v) => ({ value: v }))).toEqual(items);
    expect(rankOptions(items, 'apple', (v) => ({ value: v }))[0]).toBe('Apple');
    expect(rankOptions(items, 'apple', (v) => ({ value: v }))).not.toContain('Banana');
    expect(rankOptions(items, 'zz', (v) => ({ value: v }))).toEqual([]);
  });
});
