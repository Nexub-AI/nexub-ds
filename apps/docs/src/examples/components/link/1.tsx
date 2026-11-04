import { Link } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <Link href="#" variant="default">Default</Link>
      <Link href="#" variant="muted">Muted</Link>
      <Link href="#" variant="underlined">Underline</Link>
    </div>
  );
}
