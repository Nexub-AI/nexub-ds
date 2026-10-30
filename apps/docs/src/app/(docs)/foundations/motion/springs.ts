import * as fs from 'node:fs';
import * as path from 'node:path';

export type Family = 'spatial' | 'effects' | 'expressive';
export type Speed = 'fast' | 'default' | 'slow';

export interface SpringToken {
  family: Family;
  speed: Speed;
  durationMs: number;
  /** Progress samples from the token's CSS `linear()` easing, evenly spaced in time. */
  points: number[];
}

/**
 * The spring tokens as built by @nexub/tokens (dist/css/variables.css), read at
 * build time so the gallery plots exactly what ships.
 */
export function readSprings(): SpringToken[] {
  const css = fs.readFileSync(path.resolve(process.cwd(), '../../packages/tokens/dist/css/variables.css'), 'utf8');
  const out: SpringToken[] = [];
  for (const family of ['spatial', 'effects', 'expressive'] as const) {
    for (const speed of ['fast', 'default', 'slow'] as const) {
      const dur = css.match(new RegExp(`--motion-spring-${family}-${speed}-duration:\\s*([\\d.]+)ms`));
      const ease = css.match(new RegExp(`--motion-spring-${family}-${speed}-easing:\\s*linear\\(([^)]*)\\)`));
      if (!dur?.[1] || !ease?.[1]) continue;
      out.push({ family, speed, durationMs: Number(dur[1]), points: ease[1].split(',').map((p) => Number.parseFloat(p)) });
    }
  }
  return out;
}
