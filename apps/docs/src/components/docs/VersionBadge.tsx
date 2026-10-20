import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Reads the library version from `packages/react/package.json` once at module
 * load. All five workspace packages publish at the same version (see
 * PUBLISHING.md), so reading any one is fine.
 *
 * Anchored on `process.cwd()`, which is `apps/docs` during both `next build`
 * and `next dev`. This is more reliable than the previous `INIT_CWD` lookup,
 * which fell through to a hardcoded fallback whenever the env var wasn't set.
 *
 * The fallback below MUST be kept in sync with the real workspace version so
 * the docs never silently lie if the read ever fails again.
 */
const FALLBACK_VERSION = '0.0.2';

function readLibVersion(): string {
  try {
    const pkgPath = path.resolve(process.cwd(), '../../packages/react/package.json');
    const raw = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(raw) as { version?: string };
    return pkg.version ?? FALLBACK_VERSION;
  } catch {
    return FALLBACK_VERSION;
  }
}

const VERSION = readLibVersion();

export function VersionBadge() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        background: 'var(--color-info-container)',
        color: 'var(--color-info)',
        border: '1px solid color-mix(in srgb, var(--color-info) 35%, transparent)',
        borderRadius: 'var(--shape-control)',
        fontSize: '0.7rem',
        fontWeight: 600,
        fontFamily: 'var(--font-family-mono)',
        letterSpacing: '0.02em',
      }}
    >
      v{VERSION}
    </span>
  );
}
