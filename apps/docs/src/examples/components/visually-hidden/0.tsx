import { Link, VisuallyHidden } from '@nexub/react';

export default function Example() {
  return (
    <Link href="https://example.com" target="_blank" rel="noreferrer">
      Status page
      <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
    </Link>
  );
}
