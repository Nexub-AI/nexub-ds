import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'toast',
    title: 'Toast',
    description: 'Imperative toast notifications using the toast object. Render <Toaster /> once in your layout.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'Toaster position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'", default: "'bottom-right'", required: false, description: 'Where toasts appear on screen.' },
    { name: 'Toaster richColors', type: 'boolean', default: 'false', required: false, description: 'Enables fully coloured backgrounds for success, error, warning, and info toasts.' },
    { name: 'Toaster closeButton', type: 'boolean', default: 'false', required: false, description: 'Renders a close button on each toast.' },
    { name: 'toast.success(title, opts?)', type: 'string', required: true, description: 'Show a success toast with an optional options object.' },
    { name: 'toast.error(title, opts?)', type: 'string', required: true, description: 'Show an error toast.' },
    { name: 'toast.warning(title, opts?)', type: 'string', required: true, description: 'Show a warning toast.' },
    { name: 'toast.info(title, opts?)', type: 'string', required: true, description: 'Show an info toast.' },
    { name: 'toast.custom(title, opts?)', type: 'string', required: true, description: 'Show a default/custom toast.' },
    { name: 'opts.description', type: 'string', required: false, description: 'Secondary supporting text below the title.' },
    { name: 'opts.duration', type: 'number', default: '4000', required: false, description: 'Time in ms before auto-dismiss. Use Infinity to persist.' },
    { name: 'opts.action', type: '{ label: string; onClick: () => void }', required: false, description: 'Renders an action button inside the toast.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `function DefaultToast() {
  return (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() => toast.custom('Changes saved', { description: 'Your profile has been updated.' })}
      >
        Show toast
      </Button>
    </>
  );
}`,
    },
    {
      title: 'Variants',
      code: `function ToastVariants() {
  return (
    <>
      <Toaster richColors />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="outline" onClick={() => toast.custom('Default notification')}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success('Saved successfully')}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error('Something went wrong')}>
          Error
        </Button>
        <Button variant="outline" onClick={() => toast.warning('Proceed with caution')}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.info('New update available')}>
          Info
        </Button>
      </div>
    </>
  );
}`,
    },
    {
      title: 'With action',
      code: `function ToastWithAction() {
  return (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast.custom('Message sent', {
            description: 'Your message has been delivered to the team.',
            action: {
              label: 'Undo',
              onClick: () => {},
            },
          })
        }
      >
        Send message
      </Button>
    </>
  );
}`,
    },
  ],
  usage: {
    whenToUse: [
    "Confirming a non-blocking action (file saved, message sent)",
    "Reporting a background event the user should know about",
    "Providing brief feedback that disappears automatically",
    "Offering an undo action immediately after a destructive operation",
    ],
    whenNotToUse: [
    "Critical errors that block the user — use Alert or AlertDialog",
    "Information the user must read and acknowledge — use Dialog",
    "Persistent status that should remain visible — use Banner or Alert",
    "Long messages with multiple lines of text",
    ],
  },
};

export default entry;
