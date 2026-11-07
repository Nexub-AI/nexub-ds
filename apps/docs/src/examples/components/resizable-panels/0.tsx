import { ResizablePanels } from '@nexub/react';

export default function Example() {
  return (
    <ResizablePanels defaultSizes={[35, 65]} minSizes={[20, 30]} className="h-64 w-full rounded-shape-container border border-[var(--color-outline-variant)]">
      <ul className="flex flex-col gap-2 p-4 text-body-md">
        <li>Quarterly report</li>
        <li>Launch checklist</li>
        <li>Hiring plan</li>
      </ul>
      <div className="p-4 text-body-md">Drag the line, or focus it with Tab and use the arrow keys.</div>
    </ResizablePanels>
  );
}
