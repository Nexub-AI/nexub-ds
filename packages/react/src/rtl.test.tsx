import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NexubProvider } from './components/NexubProvider/NexubProvider.js';
import { TreeView } from './components/TreeView/TreeView.js';
import { ResizablePanels } from './components/ResizablePanels/ResizablePanels.js';
import { Kanban } from './components/Kanban/Kanban.js';

// 6.8 RTL sweep: arrow keys follow the reading direction in the 6.x components.
const rtl = (ui: React.ReactElement) =>
  render(
    <NexubProvider locale="ar" dir="rtl">
      <div dir="rtl" style={{ direction: 'rtl' }}>
        {ui}
      </div>
    </NexubProvider>,
  );

describe('RTL keyboard', () => {
  it('TreeView: ArrowLeft opens, ArrowRight closes', async () => {
    rtl(<TreeView aria-label="Files" nodes={[{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B' }] }]} />);
    await userEvent.tab();
    const item = screen.getByRole('treeitem', { name: /^A/ });
    await userEvent.keyboard('{ArrowLeft}');
    expect(item).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(item).toHaveAttribute('aria-expanded', 'false');
  });

  it('ResizablePanels: ArrowLeft grows the first panel', async () => {
    const onSizesChange = vi.fn();
    rtl(
      <ResizablePanels defaultSizes={[40, 60]} onSizesChange={onSizesChange}>
        <div>A</div>
        <div>B</div>
      </ResizablePanels>,
    );
    screen.getByRole('separator').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onSizesChange).toHaveBeenLastCalledWith([45, 55]);
  });

  it('Kanban: Alt+ArrowLeft moves a card to the next column', async () => {
    const onChange = vi.fn();
    rtl(
      <Kanban
        columns={[
          { id: 'todo', title: 'To do', items: ['x'] },
          { id: 'done', title: 'Done', items: [] },
        ]}
        getId={(i) => i}
        getLabel={(i) => i}
        onChange={onChange}
        renderCard={(i) => i}
      />,
    );
    screen.getByRole('button', { name: 'Move x' }).focus();
    await userEvent.keyboard('{Alt>}{ArrowLeft}{/Alt}');
    expect(onChange.mock.calls[0]![0][1].items).toEqual(['x']);
  });
});
