import { Badge } from '@nexub/react';

/** The @nexub/react version, read once at build in next.config.mjs. All packages publish at the same version. */
export const DS_VERSION = process.env.NEXT_PUBLIC_DS_VERSION ?? '';

export function VersionBadge() {
  return (
    <Badge tone="info" variant="soft" className="font-mono">
      v{DS_VERSION}
    </Badge>
  );
}
