import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'collapsible',
    title: 'Collapsible',
    description: 'Toggle visibility of content with smooth animation.',
    category: 'Disclosure',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Collapsible.Root open', type: 'boolean', required: false, description: 'Controlled open state.' },
    { name: 'Collapsible.Root defaultOpen', type: 'boolean', default: 'false', required: false, description: 'Whether the collapsible is open by default (uncontrolled).' },
    { name: 'Collapsible.Root onOpenChange', type: '(open: boolean) => void', required: false, description: 'Callback fired when the open state changes.' },
    { name: 'Collapsible.Root disabled', type: 'boolean', default: 'false', required: false, description: 'Prevents the user from toggling the collapsible.' },
    { name: 'Collapsible.Trigger asChild', type: 'boolean', default: 'false', required: false, description: 'Merges props onto the immediate child element (Radix Slot).' },
    { name: 'Collapsible.Content forceMount', type: 'boolean', default: 'false', required: false, description: 'Keeps the content mounted in the DOM even when closed.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Collapsible.Root>
  <Collapsible.Trigger asChild>
    <Button variant="outline">Toggle details</Button>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div style={{ paddingTop: '12px', color: 'var(--color-text-secondary)' }}>
      Hidden content revealed on toggle.
    </div>
  </Collapsible.Content>
</Collapsible.Root>`,
    },
    {
      title: 'Controlled',
      code: `function ControlledExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 500 }}>Advanced settings</span>
        <Collapsible.Trigger asChild>
          <IconButton
            aria-label={open ? 'Collapse' : 'Expand'}
            variant="ghost"
            size="sm"
          />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch id="notif" />
            <Label htmlFor="notif">Enable notifications</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch id="autosave" />
            <Label htmlFor="autosave">Auto-save drafts</Label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch id="tooltips" />
            <Label htmlFor="tooltips">Show tooltips</Label>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}`,
    },
  ],
};

export default entry;
