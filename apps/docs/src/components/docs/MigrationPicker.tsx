'use client';

import { usePathname, useRouter } from 'next/navigation';
import { VersionSelect } from './VersionSelect';

// Newest first. Add a guide here and it appears in every guide's picker; the
// sidebar has one entry for all of them (see "Migrating to the latest version").
const GUIDES = [
  { value: '/getting-started/migrating-to-9', label: '9.0' },
  { value: '/getting-started/migrating-to-8', label: '8.0 (latest)' },
  { value: '/getting-started/migrating-to-7', label: '7.0' },
  { value: '/getting-started/migrating-to-6', label: '6.0' },
  { value: '/getting-started/migrating-to-5', label: '5.0' },
  { value: '/getting-started/migrating-to-4', label: '4.0' },
  { value: '/getting-started/migrating-to-3', label: '3.0' },
];

/** Switches between the migration guides; each guide keeps its own URL. */
export function MigrationPicker() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <VersionSelect
      label="Migrating to"
      value={pathname.replace(/\/$/, '')}
      options={GUIDES}
      onValueChange={(href) => router.push(href)}
    />
  );
}
