import * as React from 'react';
import { Collapsible, Button, Switch, Label } from '@nexub/react';

export default function Example() {
  const [open2, setOpen2] = React.useState(false);
  return (
    <Collapsible.Root open={open2} onOpenChange={setOpen2}>
      <div className="flex items-center gap-2">
        <span className="font-medium text-[var(--color-on-surface)] text-body-sm">Advanced settings</span>
        <Collapsible.Trigger asChild>
          <Button variant="ghost" size="sm">{open2 ? 'Collapse' : 'Expand'}</Button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div className="pt-3 flex flex-col gap-3">
          {[
            { id: 'notif', label: 'Enable notifications' },
            { id: 'autosave', label: 'Auto-save drafts' },
            { id: 'tooltips', label: 'Show tooltips' },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center gap-2">
              <Switch id={id} />
              <Label htmlFor={id}>{label}</Label>
            </div>
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
