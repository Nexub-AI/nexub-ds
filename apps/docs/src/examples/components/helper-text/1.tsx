'use client'; // docs preview: server pages import every example

import { HelperText } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <HelperText tone="info">Sync runs every 10 minutes.</HelperText>
      <HelperText tone="success">Your account is verified.</HelperText>
      <HelperText tone="warning">This action cannot be reversed.</HelperText>
      <HelperText tone="danger">Required field is missing.</HelperText>
    </div>
  );
}
