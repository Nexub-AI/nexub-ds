import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Aurora } from './Aurora.js';

describe('Aurora', () => {
  it('is decorative, server-rendered and CSP-safe', () => {
    const html = renderToString(<Aurora className="rounded-shape-container" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('class="nx-aurora rounded-shape-container"');
    expect(html.match(/<span>/g)).toHaveLength(3);
    expect(html).not.toContain('style=');
  });
});
