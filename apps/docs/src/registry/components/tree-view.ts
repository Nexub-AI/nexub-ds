import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'tree-view',
    title: 'Tree View',
    description: 'A keyboard-friendly hierarchy (ARIA tree) with lazy children and tri-state checkboxes.',
    category: 'Navigation',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '6.3.0',
    related: ['data-table', 'sidebar'],
  },
  props: [
    { name: 'nodes', type: 'TreeNode[]', required: true, description: '`{ id, label, textValue?, icon?, children?, hasChildren?, disabled?, trailing?, href? }`. `trailing` (11.5) is meta at the row end, e.g. a count or a date. `href` (11.5) makes the row a link: click and Enter follow it, Cmd/Ctrl-click and middle-click open a new tab.' },
    { name: 'aria-label / aria-labelledby', type: 'string', required: true, description: 'Names the tree.' },
    { name: 'expanded / defaultExpanded / onExpandedChange', type: 'string[]', required: false, description: 'Open node ids.' },
    { name: 'selected / defaultSelected / onSelectedChange', type: 'string | null', required: false, description: 'Single selection, set by click, Enter or Space.' },
    { name: 'onActivate', type: '(node) => void', required: false, description: '11.5. Opens a node: Enter or double-click. Separate from selection, which click and Space set (Enter selects too). Disabled nodes never activate.' },
    { name: 'renderActions', type: '(node) => ReactNode', required: false, description: '11.5. Row actions, shown on hover and focus and always on touch screens. Their space is always reserved, so rows never shift. Tab from the focused row reaches them; the item is named by its label and `trailing` only.' },
    { name: 'ref', type: 'Ref<TreeViewHandle>', required: false, description: '11.5. `scrollToNode(id, { focus? })` opens the node\'s ancestors, then scrolls its row into view (and focuses it).' },
    { name: 'checkable', type: 'boolean', required: false, description: 'Checkboxes instead of selection. A parent is checked when all its children are and mixed when some are.' },
    { name: 'checked / defaultChecked / onCheckedChange', type: 'string[]', required: false, description: 'Every checked id, parents included.' },
    { name: 'onLoadChildren', type: '(node) => Promise', required: false, description: 'Called when a `hasChildren` node without `children` opens. Load them and pass the new `nodes`; the item is `aria-busy` meanwhile.' },
  ],
  examples: [{ title: 'Lazy loading and selection' }, { title: 'Checkboxes' }, { title: 'Actions, meta, links and scrollToNode' }],
  a11y: {
    roles: ['tree', 'treeitem with aria-level, aria-setsize, aria-posinset, aria-expanded', 'group'],
    keyboard: [
      { key: 'ArrowDown / ArrowUp', description: 'Next or previous visible item.' },
      { key: 'ArrowRight', description: 'Opens a closed item, or moves to its first child. Mirrored in RTL.' },
      { key: 'ArrowLeft', description: 'Closes an open item, or moves to its parent. Mirrored in RTL.' },
      { key: 'Home / End', description: 'First or last visible item.' },
      { key: 'Enter', description: 'Selects the item (or toggles its checkbox), calls `onActivate` and follows a link node.' },
      { key: 'Space', description: 'Selects the item, or toggles its checkbox.' },
      { key: 'Tab', description: 'From the focused item to its row actions (`renderActions`), then out of the tree.' },
      { key: 'Type a letter', description: 'Moves to the next item starting with the typed text.' },
    ],
    focus: ['The tree is one tab stop (roving tabindex); it returns to the last focused or the selected item.'],
  },
};

export default entry;
