import * as fs from 'node:fs';
import * as path from 'node:path';

export function VersionBadge() {
  let version = '0.0.1';
  try {
    // __dirname is the compiled output dir; resolve relative to repo root via INIT_CWD or fallback
    const repoRoot = process.env.INIT_CWD ?? path.join(process.cwd(), '../..');
    const pkgPath = path.join(repoRoot, 'packages/react/package.json');
    const raw = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(raw) as { version: string };
    version = pkg.version;
  } catch {
    // fallback
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        background: 'var(--color-semantic-info-bg)',
        color: 'var(--color-semantic-info-default)',
        border: '1px solid var(--color-semantic-info-border)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.7rem',
        fontWeight: 600,
        fontFamily: 'var(--font-family-mono)',
        letterSpacing: '0.02em',
      }}
    >
      v{version}
    </span>
  );
}
