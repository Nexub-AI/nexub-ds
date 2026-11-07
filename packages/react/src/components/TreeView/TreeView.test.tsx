import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TreeView, type TreeNode } from './TreeView.js';

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
