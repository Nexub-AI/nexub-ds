import { Logo } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Logo product="Command Hub" size="sm" />
      <Logo product="Command Hub" />
      <Logo product="Command Hub" size="lg" />
    </div>
  );
}
