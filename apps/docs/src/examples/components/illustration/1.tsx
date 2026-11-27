'use client'; // docs preview: server pages import every example

import { Illustration } from '@nexub/react';

const kinds = ['noData', 'noResults', 'noAccess', 'serverError', 'offline', 'notFound', 'maintenance', 'success'] as const;

export default function Example() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {kinds.map((kind) => (
        <Illustration key={kind} kind={kind} title={kind} />
      ))}
    </div>
  );
}
