'use client'; // docs preview: server pages import every example

import { StatusPage } from '@nexub/patterns';

// Call your data layer's refetch here.
const retry = () => {};

export default function Example() {
  return <StatusPage as="div" kind="serverError" code="500" onRetry={retry} />;
}
