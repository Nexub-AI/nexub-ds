import { IconButton } from '@nexub/react';

export default function Example() {
  const icon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>;
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <IconButton variant="ghost" label="Ghost">{icon}</IconButton>
      <IconButton variant="solid" label="Solid">{icon}</IconButton>
      <IconButton variant="outline" label="Outline">{icon}</IconButton>
      <IconButton variant="subtle" label="Subtle">{icon}</IconButton>
    </div>
  );
}
