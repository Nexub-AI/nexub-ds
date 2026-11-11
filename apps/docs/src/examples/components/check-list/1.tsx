import { CheckList, CheckListItem } from '@nexub/react';

export default function Example() {
  return (
    <CheckList aria-label="Password requirements">
      <CheckListItem>At least 12 characters</CheckListItem>
      <CheckListItem>One number <span className="text-[var(--color-on-surface-muted)]">(0–9)</span></CheckListItem>
      <CheckListItem>Not used on another account</CheckListItem>
    </CheckList>
  );
}
