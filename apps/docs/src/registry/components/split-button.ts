import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'split-button',
    title: 'Split Button',
    description: 'A primary action with related secondary actions behind a chevron, as one connected control.',
    category: 'Actions',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '1.5.0',
    related: ['button', 'button-group', 'dropdown-menu'],
  },
  props: [
    { name: 'menuLabel', type: 'string', required: true, description: 'Accessible name of the menu toggle, e.g. "More save options".' },
    { name: 'menu', type: 'ReactNode', required: true, description: '`DropdownMenu.Item`s for the secondary actions.' },
    { name: 'align', type: "'start' | 'end'", default: "'end'", required: false, description: 'Menu alignment against the toggle.' },
    { name: 'variant / size / tone', type: 'Button props', required: false, description: 'Applied to both halves.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<SplitButton
  onClick={save}
  menuLabel="More save options"
  menu={
    <>
      <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
      <DropdownMenu.Item>Save a copy</DropdownMenu.Item>
    </>
  }
>
  Save
</SplitButton>`,
    },
    {
      title: 'Outlined',
      code: `<SplitButton variant="outlined" menuLabel="More export options" menu={<DropdownMenu.Item>CSV</DropdownMenu.Item>}>
  Export
</SplitButton>`,
    },
  ],
};

export default entry;
