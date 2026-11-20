import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { encodeQR, qrPath } from '@nexub/core';
import { QRCode } from './QRCode.js';

const URL = 'https://example.com/h/4729';
const svgOf = (container: HTMLElement) => container.querySelector('svg')!;

describe('QRCode', () => {
  it('draws the matrix as one crisp path inside the quiet zone', () => {
    const { container } = render(<QRCode value={URL} />);
    const svg = svgOf(container);
    const { modules, size } = encodeQR(URL, { ecc: 'M' });
    expect(svg.getAttribute('viewBox')).toBe(`0 0 ${size + 8} ${size + 8}`);
    expect(svg.getAttribute('shape-rendering')).toBe('crispEdges');
    expect(svg.querySelectorAll('path')).toHaveLength(1);
    expect(svg.querySelector('path')!.getAttribute('d')).toBe(qrPath(modules, 4));
  });

  it('is an image named after its value, or by `label`', () => {
    const { rerender } = render(<QRCode value={URL} />);
    expect(screen.getByRole('img', { name: `QR code for ${URL}` })).toBeTruthy();
    rerender(<QRCode value={URL} label="Pay order 4729" />);
    expect(screen.getByRole('img', { name: 'Pay order 4729' })).toBeTruthy();
  });

  it('shows the value as text, a custom caption, or none', () => {
    const { rerender, container } = render(<QRCode value={URL} />);
    expect(container.querySelector('figcaption')!.textContent).toBe(URL);
    rerender(<QRCode value={URL} caption="Order 4729" />);
    expect(container.querySelector('figcaption')!.textContent).toBe('Order 4729');
    rerender(<QRCode value={URL} caption={false} />);
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('stays dark on light in every theme and in forced colours', () => {
    const { container } = render(
      <div data-theme="dark">
        <QRCode value={URL} />
      </div>,
    );
    const tile = svgOf(container).parentElement!;
    expect(tile.getAttribute('data-theme')).toBe('light');
    expect(tile.className).toContain('bg-[var(--color-surface-container-lowest)]');
    expect(tile.className).toContain('forced-color-adjust-none');
    expect(svgOf(container).getAttribute('class')).toContain('fill-[var(--color-on-surface)]');
  });

  it('a logo raises the error correction to H; an explicit `ecc` wins', () => {
    const { container, rerender } = render(<QRCode value={URL} logo={<svg data-testid="mark" />} />);
    expect(svgOf(container).querySelector('path')!.getAttribute('d')).toBe(qrPath(encodeQR(URL, { ecc: 'H' }).modules, 4));
    const tile = screen.getByTestId('mark').parentElement!;
    expect(tile.getAttribute('aria-hidden')).toBe('true');
    expect(tile.className).toContain('size-1/5');
    rerender(<QRCode value={URL} logo={<svg data-testid="mark" />} ecc="Q" />);
    expect(svgOf(container).querySelector('path')!.getAttribute('d')).toBe(qrPath(encodeQR(URL, { ecc: 'Q' }).modules, 4));
  });

  it('takes a size in pixels or as a CSS length, a quiet zone and a ref', () => {
    const ref = React.createRef<HTMLElement>();
    const { container, rerender } = render(<QRCode ref={ref} value="NX-4729" size={200} quietZone={0} className="mx-auto" />);
    const figure = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(figure);
    expect(figure.style.width).toBe('200px');
    expect(figure.className).toContain('mx-auto');
    expect(svgOf(container).getAttribute('viewBox')).toBe('0 0 21 21');
    rerender(<QRCode value="NX-4729" size="10rem" />);
    expect((container.firstElementChild as HTMLElement).style.width).toBe('10rem');
  });

  it('renders on the server', () => {
    const html = renderToString(<QRCode value={URL} />);
    expect(html).toContain('<path d="M4 4h7v1h-7z');
    expect(html).toContain(URL);
  });
});
