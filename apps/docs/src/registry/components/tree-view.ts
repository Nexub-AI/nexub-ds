import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tree-view',
    title: 'Tree View',
    description: 'A keyboard-friendly hierarchy (ARIA tree) with lazy children and tri-state checkboxes.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.3.0',
    related: ['data-table', 'sidebar'],
  },
  props: [
    { name: 'nodes', type: 'TreeNode[]', required: true, description: '`{ id, label, textValue?, icon?, children?, hasChildren?, disabled? }`.' },
    { name: 'aria-label / aria-labelledby', type: 'string', required: true, description: 'Names the tree.' },
    { name: 'expanded / defaultExpanded / onExpandedChange', type: 'string[]', required: false, description: 'Open node ids.' },
    { name: 'selected / defaultSelected / onSelectedChange', type: 'string | null', required: false, description: 'Single selection, set by click, Enter or Space.' },
    { name: 'checkable', type: 'boolean', required: false, description: 'Checkboxes instead of selection. A parent is checked when all its children are and mixed when some are.' },
    { name: 'checked / defaultChecked / onCheckedChange', type: 'string[]', required: false, description: 'Every checked id, parents included.' },
    { name: 'onLoadChildren', type: '(node) => Promise', required: false, description: 'Called when a `hasChildren` node without `children` opens. Load them and pass the new `nodes`; the item is `aria-busy` meanwhile.' },
  ],
  examples: [{ title: 'Lazy loading and selection' }, { title: 'Checkboxes' }],
  a11y: {
    roles: ['tree', 'treeitem with aria-level, aria-setsize, aria-posinset, aria-expanded', 'group'],
    keyboard: [
      { key: 'ArrowDown / ArrowUp', description: 'Next or previous visible item.' },
      { key: 'ArrowRight', description: 'Opens a closed item, or moves to its first child. Mirrored in RTL.' },
      { key: 'ArrowLeft', description: 'Closes an open item, or moves to its parent. Mirrored in RTL.' },
      { key: 'Home / End', description: 'First or last visible item.' },
      { key: 'Enter / Space', description: 'Selects the item, or toggles its checkbox.' },
      { key: 'Type a letter', description: 'Moves to the next item starting with the typed text.' },
    ],
    focus: ['The tree is one tab stop (roving tabindex); it returns to the last focused or the selected item.'],
  },
};

export default entry;
