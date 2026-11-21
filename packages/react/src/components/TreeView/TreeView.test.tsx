import { ErrorState } from '../ErrorState/ErrorState.js';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TreeView, type TreeNode, type TreeViewHandle } from './TreeView.js';

const nodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'app', label: 'app.tsx' },
      { id: 'lib', label: 'lib', children: [{ id: 'util', label: 'util.ts' }, { id: 'api', label: 'api.ts' }] },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

const item = (name: string) => screen.getByRole('treeitem', { name: new RegExp(`^${name}`) });

describe('TreeView', () => {
  it('APG keyboard: arrows move and expand, Left goes to parent, type-ahead, Enter selects', async () => {
    const onSelectedChange = vi.fn();
    render(<TreeView aria-label="Files" nodes={nodes} onSelectedChange={onSelectedChange} />);
    expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
    await userEvent.tab();
    expect(item('src')).toHaveFocus();
    expect(item('src')).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{ArrowRight}');
    expect(item('src')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowRight}{ArrowDown}{ArrowRight}{ArrowRight}');
    expect(item('util.ts')).toHaveFocus();
    expect(item('util.ts')).toHaveAttribute('aria-level', '3');
    await userEvent.keyboard('{ArrowLeft}');
    expect(item('lib')).toHaveFocus();
    await userEvent.keyboard('r');
    expect(item('README.md')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onSelectedChange).toHaveBeenCalledWith('readme');
    expect(item('README.md')).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    expect(item('src')).toHaveFocus();
  });

  it('checkable: parents are mixed or checked from their children', async () => {
    const onCheckedChange = vi.fn();
    render(<TreeView aria-label="Files" nodes={nodes} checkable defaultExpanded={['src', 'lib']} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText('util.ts'));
    expect(item('lib')).toHaveAttribute('aria-checked', 'mixed');
    expect(item('src')).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(screen.getByText('api.ts'));
    expect(item('lib')).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByText('src'));
    expect(onCheckedChange).toHaveBeenLastCalledWith(expect.arrayContaining(['src', 'app', 'lib', 'util', 'api']));
  });

  it('lazy children: expanding loads them and marks the item busy meanwhile', async () => {
    let resolve!: () => void;
    function Lazy() {
      const [list, setList] = React.useState<TreeNode[]>([{ id: 'team', label: 'Team', hasChildren: true }]);
      return (
        <TreeView
          aria-label="Org"
          nodes={list}
          onLoadChildren={() =>
            new Promise<void>((r) => (resolve = r)).then(() =>
              setList([{ id: 'team', label: 'Team', children: [{ id: 'ada', label: 'Ada' }] }]),
            )
          }
        />
      );
    }
    render(<Lazy />);
    await userEvent.click(screen.getByText('Team'));
    expect(item('Team')).toHaveAttribute('aria-busy', 'true');
    resolve();
    expect(await screen.findByRole('treeitem', { name: 'Ada' })).toBeInTheDocument();
  });
});

describe('TreeView 10.5: data states and indent', () => {
  it('loading shows skeleton rows in a busy group instead of the tree', () => {
    const { container } = render(<TreeView aria-label="Files" nodes={nodes} loading />);
    expect(screen.getByRole('group', { name: 'Files' }).getAttribute('aria-busy')).toBe('true');
    expect(screen.queryByRole('tree')).toBeNull();
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(4);
  });

  it('no nodes shows the default message or emptyState; errorState wins', () => {
    const { rerender } = render(<TreeView aria-label="Files" nodes={[]} />);
    expect(screen.getByText('Nothing here yet')).toBeTruthy();
    rerender(<TreeView aria-label="Files" nodes={[]} emptyState="No files" />);
    expect(screen.getByText('No files')).toBeTruthy();
    rerender(<TreeView aria-label="Files" nodes={[]} loading emptyState="No files" errorState={<ErrorState title="Failed" />} />);
    expect(screen.getByRole('heading', { name: 'Failed' })).toBeTruthy();
    expect(screen.queryByText('No files')).toBeNull();
    expect(screen.getByRole('group', { name: 'Files' }).hasAttribute('aria-busy')).toBe(false);
  });

  it('indents rows with classes, not a style set on mount', () => {
    render(<TreeView aria-label="Files" nodes={nodes} defaultExpanded={['src', 'lib']} />);
    const row = (name: string) => item(name).firstElementChild as HTMLElement;
    expect(row('src').className).toContain('ps-[0.25rem]');
    expect(row('util').className).toContain('ps-[2.75rem]');
    expect(row('util').style.paddingInlineStart).toBe('');
  });

  it('collapsing removes the group at once when no transition runs', async () => {
    const user = userEvent.setup();
    render(<TreeView aria-label="Files" nodes={nodes} defaultExpanded={['src']} />);
    await user.click(item('src').firstElementChild!);
    expect(screen.queryByRole('treeitem', { name: 'app.tsx' })).toBeNull();
    expect(screen.queryByText('app.tsx')).toBeNull();
  });
});

describe('TreeView 11.5: actions, trailing, links, onActivate, scrollToNode', () => {
  const mail: TreeNode[] = [
    { id: 'inbox', label: 'Inbox', trailing: '12', children: [{ id: 'work', label: 'Work', href: '/mail/work' }] },
    { id: 'sent', label: 'Sent', href: '/mail/sent' },
  ];

  it('actions do not select, are named apart from the item, and only the tab-stop row is in the tab order', async () => {
    const onSelectedChange = vi.fn();
    const onRename = vi.fn();
    render(
      <TreeView
        aria-label="Mail"
        nodes={mail}
        onSelectedChange={onSelectedChange}
        renderActions={(n) => <button type="button" aria-label={`Rename ${String(n.label)}`} onClick={() => onRename(n.id)} />}
      />,
    );
    expect(screen.getByRole('treeitem', { name: 'Inbox 12' })).toBeInTheDocument();
    await userEvent.tab();
    expect(item('Inbox')).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Rename Inbox' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Rename Sent' })).toHaveAttribute('tabindex', '-1');
    await userEvent.keyboard('{Enter}');
    expect(onRename).toHaveBeenCalledWith('inbox');
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it('Enter and double-click activate; Space and click only select', async () => {
    const onActivate = vi.fn();
    const onSelectedChange = vi.fn();
    render(<TreeView aria-label="Mail" nodes={mail} onActivate={onActivate} onSelectedChange={onSelectedChange} />);
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(onSelectedChange).toHaveBeenLastCalledWith('inbox');
    expect(onActivate).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    expect(onActivate).toHaveBeenCalledWith(mail[0]);
    // The double-click's first click opens Inbox; its second doesn't close it again.
    await userEvent.dblClick(screen.getByText('Inbox'));
    expect(onActivate).toHaveBeenCalledTimes(2);
    expect(item('Inbox')).toHaveAttribute('aria-expanded', 'true');
  });

  it('link nodes render the row as a link that Enter follows', async () => {
    render(<TreeView aria-label="Mail" nodes={mail} />);
    const link = screen.getByText('Sent').closest('a')!;
    expect(link).toHaveAttribute('href', '/mail/sent');
    expect(link).toHaveAttribute('tabindex', '-1');
    const followed = vi.fn((e: MouseEvent) => e.preventDefault());
    link.addEventListener('click', followed);
    item('Sent').focus();
    await userEvent.keyboard('{Enter}');
    expect(followed).toHaveBeenCalledTimes(1);
    expect(item('Sent')).toHaveAttribute('aria-selected', 'true');
  });

  it('scrollToNode opens the ancestors and can focus the node', async () => {
    const ref = React.createRef<TreeViewHandle>();
    render(<TreeView ref={ref} aria-label="Mail" nodes={mail} />);
    expect(screen.queryByText('Work')).toBeNull();
    React.act(() => ref.current!.scrollToNode('work', { focus: true }));
    expect(item('Inbox')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Work')).toHaveFocus();
  });
});
