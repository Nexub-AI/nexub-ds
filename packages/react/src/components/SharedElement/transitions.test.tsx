import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SharedElement, transitionName } from './SharedElement.js';
import { ScrollProgress } from '../ScrollProgress/ScrollProgress.js';
import { FloatingInput } from '../FloatingInput/FloatingInput.js';

describe('4.4 transitions', () => {
  it('SharedElement names its child through the CSSOM with a valid ident', () => {
    render(<SharedElement name="avatar 42/x"><img alt="Sam" src="data:," /></SharedElement>);
    const img = screen.getByRole('img', { name: 'Sam' });
    expect(img.style.getPropertyValue('view-transition-name')).toBe('nx-avatar-42-x');
    expect(transitionName('a.b')).toBe('nx-a-b');
  });

  it('ScrollProgress is decorative and server-rendered with no style attribute', () => {
    const html = renderToString(<ScrollProgress />);
    expect(html).toBe('<div aria-hidden="true" class="nx-scroll-progress"></div>');
  });

  it('FloatingInput keeps a real label tied to the input', () => {
    render(<FloatingInput label="Email" type="email" />);
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('placeholder')).toBe(' ');
    expect(renderToString(<FloatingInput label="Email" />)).not.toContain('style=');
  });
});
