import * as React from 'react';
import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Celebrate } from './Celebrate.js';
import { Card } from '../Card/Card.js';
import { Button } from '../Button/Button.js';

describe('Celebrate', () => {
  it('renders nothing until active, then a decorative burst with a path per piece', () => {
    const { container, rerender } = render(<div className="relative"><Celebrate active={false} count={6} /></div>);
    expect(container.querySelector('.nx-celebrate')).toBeNull();
    rerender(<div className="relative"><Celebrate active count={6} /></div>);
    const burst = container.querySelector('.nx-celebrate')!;
    expect(burst.getAttribute('aria-hidden')).toBe('true');
    expect(burst.children).toHaveLength(6);
    expect((burst.children[0] as HTMLElement).style.getPropertyValue('--x')).toMatch(/px$/);
  });

  it('bursts again only on the next false → true', () => {
    const { container, rerender } = render(<Celebrate active count={3} />);
    const first = container.querySelector('.nx-celebrate');
    rerender(<Celebrate active count={3} />);
    expect(container.querySelector('.nx-celebrate')).toBe(first);
    rerender(<Celebrate active={false} count={3} />);
    rerender(<Celebrate active count={3} />);
    expect(container.querySelector('.nx-celebrate')).not.toBe(first);
  });
});

describe('pointer effects', () => {
  it('Card effect="tilt" adds the sheen and the tilt', () => {
    const { container } = render(<Card effect="tilt">c</Card>);
    expect(container.firstElementChild!.className).toContain('nx-sheen');
    expect(container.firstElementChild!.className).toContain('nx-tilt');
  });

  it('Button magnetic writes the pointer fraction through the CSSOM', async () => {
    const { getByRole } = render(<Button magnetic>Pay now</Button>);
    const btn = getByRole('button');
    expect(btn.className).toContain('nx-magnetic');
    btn.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 40 }) as DOMRect;
    await act(async () => {
      btn.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 75, clientY: 10, pointerType: 'mouse' }));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(btn.style.getPropertyValue('--nx-px')).toBe('0.75');
    expect(btn.style.getPropertyValue('--nx-py')).toBe('0.25');
  });
});
