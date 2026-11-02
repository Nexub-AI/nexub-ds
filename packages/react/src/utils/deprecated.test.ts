import { afterEach, describe, expect, it, vi } from 'vitest';
import { warnDeprecated } from './deprecated';

describe('warnDeprecated', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('warns once per component outside production', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnDeprecated('TestOnce', 'Alert');
    warnDeprecated('TestOnce', 'Alert');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain('TestOnce is deprecated and will be removed in 3.0. Use Alert');
  });

  it('stays silent in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnDeprecated('TestProd', 'Badge');
    expect(warn).not.toHaveBeenCalled();
  });
});
