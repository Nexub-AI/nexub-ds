import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ReactFlow, ReactFlowProvider, addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow, type Connection, type Edge, type Node, type NodeChange } from '@xyflow/react';
import { DiagramCanvas, DiagramNode, type DiagramCanvasProps, type DiagramFlowNode } from './index.js';

const W = 240;
const H = 72;

const card = (id: string, x: number, y: number, extra: Partial<DiagramFlowNode['data']> = {}): DiagramFlowNode => ({
  id,
  type: 'nexub',
  position: { x, y },
  data: { title: id.toUpperCase(), ...extra },
});

// A 2 × 2 grid plus one to the right:   A  B  E
//                                        C  D
const grid = (): DiagramFlowNode[] => [card('a', 0, 0), card('b', 300, 0), card('c', 0, 200), card('d', 300, 200), card('e', 600, 0)];

type Props = Partial<DiagramCanvasProps<DiagramFlowNode, Edge>> & { initialNodes?: DiagramFlowNode[]; initialEdges?: Edge[] };

function Controlled({ initialNodes = grid(), initialEdges = [], onNodesChange, onEdgesChange, onConnect, ...rest }: Props) {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState<Edge[]>(initialEdges);
  return (
    <DiagramCanvas<DiagramFlowNode, Edge>
      aria-label="Workflow"
      nodes={nodes}
      edges={edges}
      onNodesChange={(c) => {
        onNodesChange?.(c);
        setNodes((ns) => applyNodeChanges(c, ns));
      }}
      onEdgesChange={(c) => {
        onEdgesChange?.(c);
        setEdges((es) => applyEdgeChanges(c, es));
      }}
      onConnect={(c) => {
        onConnect?.(c);
        setEdges((es) => addEdge(c, es));
      }}
      {...rest}
    />
  );
}

const nodeEl = (title: string) => screen.getByRole('group', { name: title });
const focused = () => (document.activeElement as HTMLElement | null)?.getAttribute('data-id');

async function renderReady(ui: React.ReactElement) {
  const result = render(ui);
  // Nodes are hidden until React Flow has measured them.
  await waitFor(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.react-flow__node'));
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.every((n) => n.style.visibility === 'visible')).toBe(true);
  });
  return result;
}

describe('DiagramCanvas', () => {
  it('names the canvas and renders DiagramNode cards with their content', async () => {
    await renderReady(<Controlled initialNodes={[card('a', 0, 0, { description: 'First step', tone: 'danger', icon: <svg data-testid="icon" /> })]} />);
    expect(screen.getByRole('application', { name: 'Workflow' })).toBeInTheDocument();
    const a = nodeEl('A');
    expect(within(a).getByText('First step')).toBeInTheDocument();
    expect(within(a).getByText('Problem')).toHaveClass('sr-only');
    expect(within(a).getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(a.querySelector('[data-tone="danger"]')).not.toBeNull();
    expect(a.querySelectorAll('.react-flow__handle')).toHaveLength(2);
  });

  it('shows the zoom controls by default and the minimap on request', async () => {
    const { rerender } = await renderReady(<Controlled />);
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fit view' })).toBeInTheDocument();
    expect(screen.queryByTestId('rf__minimap')).toBeNull();
    rerender(<Controlled controls={false} minimap />);
    expect(screen.queryByRole('button', { name: 'Zoom in' })).toBeNull();
    expect(screen.getByTestId('rf__minimap')).toBeInTheDocument();
  });

  describe('keyboard focus', () => {
    it('keeps one node in the Tab order: the first in reading order', async () => {
      await renderReady(<Controlled initialNodes={[card('c', 0, 200), card('b', 300, 0), card('a', 0, 0)]} />);
      expect(nodeEl('A')).toHaveAttribute('tabindex', '0');
      expect(nodeEl('B')).toHaveAttribute('tabindex', '-1');
      expect(nodeEl('C')).toHaveAttribute('tabindex', '-1');
    });

    it('moves focus to the nearest node with the arrow keys, and Home/End', async () => {
      await renderReady(<Controlled />);
      act(() => nodeEl('A').focus());
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowRight' });
      expect(focused()).toBe('b');
      expect(nodeEl('B')).toHaveAttribute('tabindex', '0');
      expect(nodeEl('A')).toHaveAttribute('tabindex', '-1');
      fireEvent.keyDown(nodeEl('B'), { key: 'ArrowDown' });
      expect(focused()).toBe('d');
      fireEvent.keyDown(nodeEl('D'), { key: 'ArrowLeft' });
      expect(focused()).toBe('c');
      fireEvent.keyDown(nodeEl('C'), { key: 'ArrowUp' });
      expect(focused()).toBe('a');
      // Nothing further up: focus stays.
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowUp' });
      expect(focused()).toBe('a');
      // Reading order: a, b, e (top row), then c, d.
      fireEvent.keyDown(nodeEl('A'), { key: 'End' });
      expect(focused()).toBe('d');
      fireEvent.keyDown(nodeEl('D'), { key: 'Home' });
      expect(focused()).toBe('a');
    });

    it('does not move the node on a plain arrow key, even when selected', async () => {
      const onNodesChange = vi.fn();
      await renderReady(<Controlled initialNodes={[{ ...card('a', 0, 0), selected: true }, card('b', 300, 0)]} onNodesChange={onNodesChange} />);
      onNodesChange.mockClear();
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowRight' });
      expect(onNodesChange).not.toHaveBeenCalled();
    });

    it('follows focus that arrives by other means (click, Tab)', async () => {
      await renderReady(<Controlled />);
      act(() => nodeEl('D').focus());
      expect(nodeEl('D')).toHaveAttribute('tabindex', '0');
      expect(nodeEl('A')).toHaveAttribute('tabindex', '-1');
    });

    it('orders start to end in RTL', async () => {
      render(
        <div dir="rtl">
          <Controlled initialNodes={[card('a', 0, 0), card('b', 300, 0)]} />
        </div>,
      );
      await waitFor(() => expect(nodeEl('B')).toHaveAttribute('tabindex', '0'));
    });
  });

  describe('keyboard moves', () => {
    it('moves the focused node by a grid step with Alt+Arrow, four with Shift, through onNodesChange', async () => {
      const onNodesChange = vi.fn();
      await renderReady(<Controlled onNodesChange={onNodesChange} />);
      onNodesChange.mockClear();
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowRight', altKey: true });
      expect(onNodesChange).toHaveBeenLastCalledWith([{ id: 'a', type: 'position', position: { x: 16, y: 0 }, dragging: false }]);
      expect(focused() === 'a' || document.activeElement === document.body).toBe(true);
      await waitFor(() => expect(screen.getByText('Moved A to 16, 0')).toBeInTheDocument());
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowDown', altKey: true, shiftKey: true });
      expect(onNodesChange).toHaveBeenLastCalledWith([{ id: 'a', type: 'position', position: { x: 16, y: 64 }, dragging: false }]);
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowLeft', altKey: true });
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowUp', altKey: true });
      expect(onNodesChange).toHaveBeenLastCalledWith([{ id: 'a', type: 'position', position: { x: 0, y: 48 }, dragging: false }]);
    });

    it('uses keyboardStep, and the snap grid when snapping', async () => {
      const onNodesChange = vi.fn();
      const { unmount } = await renderReady(<Controlled onNodesChange={onNodesChange} keyboardStep={5} />);
      onNodesChange.mockClear();
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowRight', altKey: true });
      expect(onNodesChange).toHaveBeenLastCalledWith([expect.objectContaining({ position: { x: 5, y: 0 } })]);
      unmount();
      await renderReady(<Controlled onNodesChange={onNodesChange} snapToGrid snapGrid={[25, 25]} />);
      onNodesChange.mockClear();
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowDown', altKey: true });
      expect(onNodesChange).toHaveBeenLastCalledWith([expect.objectContaining({ position: { x: 0, y: 25 } })]);
    });

    it('does not move a node that is not draggable', async () => {
      const onNodesChange = vi.fn();
      await renderReady(<Controlled initialNodes={[{ ...card('a', 0, 0), draggable: false }]} onNodesChange={onNodesChange} />);
      onNodesChange.mockClear();
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowRight', altKey: true });
      expect(onNodesChange).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('removes the focused node and its edges with Delete, and moves focus on', async () => {
      const onNodesChange = vi.fn();
      const onEdgesChange = vi.fn();
      await renderReady(<Controlled onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} initialEdges={[{ id: 'ab', source: 'a', target: 'b' }]} />);
      act(() => nodeEl('A').focus());
      fireEvent.keyDown(nodeEl('A'), { key: 'Delete' });
      await waitFor(() => expect(screen.queryByRole('group', { name: 'A' })).toBeNull());
      expect(onNodesChange).toHaveBeenCalledWith([{ id: 'a', type: 'remove' }]);
      expect(onEdgesChange).toHaveBeenCalledWith([{ id: 'ab', type: 'remove' }]);
      await waitFor(() => expect(focused()).toBe('b'));
      expect(screen.getByText('Deleted 2 items')).toBeInTheDocument();
    });

    it('removes the selection with Backspace (selected edge from the pane)', async () => {
      const onEdgesChange = vi.fn();
      await renderReady(<Controlled onEdgesChange={onEdgesChange} initialEdges={[{ id: 'ab', source: 'a', target: 'b', selected: true }]} />);
      fireEvent.keyDown(screen.getByRole('application'), { key: 'Backspace' });
      await waitFor(() => expect(onEdgesChange).toHaveBeenCalledWith([{ id: 'ab', type: 'remove' }]));
      await waitFor(() => expect(screen.getByText('Deleted 1 item')).toBeInTheDocument());
    });

    it('removes the selected nodes rather than the focused one', async () => {
      const onNodesChange = vi.fn();
      const nodes = grid();
      nodes[3] = { ...nodes[3]!, selected: true };
      await renderReady(<Controlled initialNodes={nodes} onNodesChange={onNodesChange} />);
      fireEvent.keyDown(nodeEl('A'), { key: 'Delete' });
      await waitFor(() => expect(onNodesChange).toHaveBeenCalledWith([{ id: 'd', type: 'remove' }]));
      expect(nodeEl('A')).toBeInTheDocument();
    });

    it('leaves Delete to React Flow when deleteKeyCode is given', async () => {
      const onNodesChange = vi.fn();
      await renderReady(<Controlled onNodesChange={onNodesChange} deleteKeyCode="x" />);
      onNodesChange.mockClear();
      fireEvent.keyDown(nodeEl('A'), { key: 'Delete' });
      await new Promise((r) => setTimeout(r, 10));
      expect(onNodesChange).not.toHaveBeenCalledWith([{ id: 'a', type: 'remove' }]);
    });
  });

  describe('Connect to… menu', () => {
    it('opens with C, lists the other nodes, and connects through onConnect', async () => {
      const onConnect = vi.fn();
      await renderReady(<Controlled onConnect={onConnect} initialEdges={[{ id: 'ab', source: 'a', target: 'b' }]} />);
      act(() => nodeEl('A').focus());
      fireEvent.keyDown(nodeEl('A'), { key: 'c' });
      const list = screen.getByRole('listbox', { name: 'Connect A to…' });
      expect(list).toHaveFocus();
      // B is already connected; the rest in reading order.
      expect(within(list).getAllByRole('option').map((o) => o.textContent)).toEqual(['E', 'C', 'D']);
      expect(within(list).getByRole('option', { name: 'E' })).toHaveAttribute('aria-selected', 'true');
      fireEvent.keyDown(list, { key: 'ArrowDown' });
      expect(within(list).getByRole('option', { name: 'C' })).toHaveAttribute('aria-selected', 'true');
      expect(list.getAttribute('aria-activedescendant')).toBe(within(list).getByRole('option', { name: 'C' }).id);
      fireEvent.keyDown(list, { key: 'ArrowUp' });
      fireEvent.keyDown(list, { key: 'ArrowUp' });
      expect(within(list).getByRole('option', { name: 'D' })).toHaveAttribute('aria-selected', 'true');
      fireEvent.keyDown(list, { key: 'Home' });
      fireEvent.keyDown(list, { key: 'End' });
      fireEvent.keyDown(list, { key: 'c' });
      expect(within(list).getByRole('option', { name: 'C' })).toHaveAttribute('aria-selected', 'true');
      fireEvent.keyDown(list, { key: 'Enter' });
      expect(onConnect).toHaveBeenCalledWith({ source: 'a', target: 'c', sourceHandle: null, targetHandle: null });
      expect(screen.queryByRole('listbox')).toBeNull();
      await waitFor(() => expect(focused()).toBe('a'));
      expect(screen.getByText('Connected A to C')).toBeInTheDocument();
      // The new edge is in the list view.
      expect(screen.getByText('Connects to: B, C')).toBeInTheDocument();
    });

    it('closes with Escape and returns focus to the node', async () => {
      const onConnect = vi.fn();
      await renderReady(<Controlled onConnect={onConnect} />);
      act(() => nodeEl('B').focus());
      fireEvent.keyDown(nodeEl('B'), { key: 'C' });
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
      expect(screen.queryByRole('listbox')).toBeNull();
      await waitFor(() => expect(focused()).toBe('b'));
      expect(onConnect).not.toHaveBeenCalled();
    });

    it('closes without stealing focus when focus leaves', async () => {
      await renderReady(
        <>
          <Controlled onConnect={() => {}} />
          <button type="button">Elsewhere</button>
        </>,
      );
      fireEvent.keyDown(nodeEl('A'), { key: 'c' });
      const other = screen.getByRole('button', { name: 'Elsewhere' });
      act(() => other.focus());
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(other).toHaveFocus();
    });

    it('opens from the button on the node and picks with a click', async () => {
      const onConnect = vi.fn();
      await renderReady(<Controlled onConnect={onConnect} />);
      fireEvent.click(within(nodeEl('D')).getByRole('button', { name: 'Connect D to…' }));
      fireEvent.click(screen.getByRole('option', { name: 'A' }));
      expect(onConnect).toHaveBeenCalledWith(expect.objectContaining({ source: 'd', target: 'a' }));
    });

    it('respects isValidConnection and says when nothing is left to connect', async () => {
      const onConnect = vi.fn();
      await renderReady(<Controlled initialNodes={[card('a', 0, 0), card('b', 300, 0)]} onConnect={onConnect} isValidConnection={() => false} />);
      fireEvent.keyDown(nodeEl('A'), { key: 'c' });
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });
      expect(onConnect).not.toHaveBeenCalled();
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
      fireEvent.keyDown(nodeEl('B'), { key: 'c' });
      // Space picks too; still invalid.
      fireEvent.keyDown(screen.getByRole('listbox'), { key: ' ' });
      expect(onConnect).not.toHaveBeenCalled();
    });

    it('shows an empty state when every node is connected', async () => {
      await renderReady(<Controlled initialNodes={[card('a', 0, 0), card('b', 300, 0)]} initialEdges={[{ id: 'ab', source: 'a', target: 'b' }]} onConnect={() => {}} />);
      fireEvent.keyDown(nodeEl('A'), { key: 'c' });
      expect(screen.getByText('No other nodes to connect to')).toBeInTheDocument();
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });
      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Tab' });
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('is off without onConnect, for nodes that cannot connect, and with nodesConnectable={false}', async () => {
      render(<DiagramCanvas aria-label="Static" nodes={grid()} edges={[]} />);
      await waitFor(() => expect(nodeEl('A')).toBeInTheDocument());
      fireEvent.keyDown(nodeEl('A'), { key: 'c' });
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(within(nodeEl('A')).queryByRole('button')).toBeNull();
    });

    it('is off for a node with connectable: false', async () => {
      await renderReady(<Controlled initialNodes={[{ ...card('a', 0, 0), connectable: false }, card('b', 300, 0)]} onConnect={() => {}} />);
      fireEvent.keyDown(nodeEl('A'), { key: 'c' });
      expect(screen.queryByRole('listbox')).toBeNull();
    });
  });

  describe('readOnly', () => {
    it('allows focus moves only: no move, connect or delete', async () => {
      const onNodesChange = vi.fn();
      const onConnect = vi.fn();
      await renderReady(<Controlled readOnly onNodesChange={onNodesChange} onConnect={onConnect} />);
      onNodesChange.mockClear();
      act(() => nodeEl('A').focus());
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowRight' });
      expect(focused()).toBe('b');
      fireEvent.keyDown(nodeEl('B'), { key: 'ArrowRight', altKey: true });
      fireEvent.keyDown(nodeEl('B'), { key: 'c' });
      fireEvent.keyDown(nodeEl('B'), { key: 'Delete' });
      fireEvent.keyDown(screen.getByRole('application'), { key: 'Backspace' });
      await new Promise((r) => setTimeout(r, 10));
      expect(onNodesChange).not.toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ type: 'position' })]));
      expect(onNodesChange).not.toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ type: 'remove' })]));
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(within(nodeEl('B')).queryByRole('button')).toBeNull();
      expect(nodeEl('B')).not.toHaveClass('draggable');
      expect(nodeEl('B')).not.toHaveClass('selectable');
      expect(nodeEl('B').querySelector('.connectable')).toBeNull();
      expect(document.querySelector('.nx-diagram')).toHaveAttribute('data-readonly');
    });

    it('describes the read-only keyboard', async () => {
      await renderReady(<Controlled readOnly />);
      const describedBy = nodeEl('A').getAttribute('aria-describedby')!;
      expect(document.getElementById(describedBy)).toHaveTextContent('Arrow keys move between nodes.');
    });
  });

  describe('list view', () => {
    it('lists every node in reading order with its connections by title', async () => {
      await renderReady(
        <Controlled
          initialNodes={[card('c', 0, 200), card('a', 0, 0, { tone: 'good' }), card('b', 300, 0)]}
          initialEdges={[
            { id: 'ab', source: 'a', target: 'b' },
            { id: 'ac', source: 'a', target: 'c' },
          ]}
        />,
      );
      const details = document.querySelector('details[data-diagram-list]')!;
      expect(within(details as HTMLElement).getByText('Show as list').tagName).toBe('SUMMARY');
      const items = within(details as HTMLElement).getAllByRole('listitem', { hidden: true }).filter((li) => li.parentElement?.parentElement === details);
      expect(items.map((li) => li.firstChild?.textContent)).toEqual(['A', 'B', 'C']);
      expect(items[0]).toHaveTextContent('A (Good)Connects to: B, C');
      expect(items[1]).toHaveTextContent('Connected from: A');
      expect(items[2]).toHaveTextContent('Connected from: A');
    });

    it('says when a node has no connections, takes labels, and can be turned off', async () => {
      const { rerender } = await renderReady(<Controlled initialNodes={[card('a', 0, 0)]} labels={{ showAsList: 'Als Liste', noConnections: 'Keine' }} />);
      expect(screen.getByText('Als Liste')).toBeInTheDocument();
      expect(screen.getByText('Keine')).toBeInTheDocument();
      rerender(<Controlled initialNodes={[card('a', 0, 0)]} listView={false} />);
      expect(document.querySelector('details[data-diagram-list]')).toBeNull();
    });

    it('names React Flow built-in nodes by their label', async () => {
      render(<DiagramCanvas aria-label="Mixed" nodes={[{ id: 'x', position: { x: 0, y: 0 }, data: { label: 'Plain' } }, { id: 'y', position: { x: 0, y: 200 }, data: {} }]} edges={[]} />);
      await waitFor(() => expect(screen.getByRole('group', { name: 'Plain' })).toBeInTheDocument());
      expect(screen.getByRole('group', { name: 'y' })).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    const tree = [card('root', 0, 0), card('a', 0, 0), card('b', 0, 0)];
    const treeEdges: Edge[] = [
      { id: 'ra', source: 'root', target: 'a' },
      { id: 'rb', source: 'root', target: 'b' },
    ];
    /** The node's translate() as "x,y" (jsdom drops a zero y and adds spaces). */
    const transformOf = (title: string) => {
      const m = nodeEl(title).style.transform.match(/translate\((-?[\d.]+)px(?:,\s*(-?[\d.]+)px)?\)/);
      return m ? `translate(${m[1]}px,${m[2] ?? 0}px)` : '';
    };

    it('lays a tree out left to right, with handles on the sides', async () => {
      await renderReady(<Controlled layout="left-right" initialNodes={tree} initialEdges={treeEdges} />);
      expect(transformOf('ROOT')).toBe(`translate(0px,${(H + 24) / 2}px)`);
      expect(transformOf('A')).toBe(`translate(${W + 80}px,0px)`);
      expect(nodeEl('A').querySelector('.react-flow__handle-left.target')).not.toBeNull();
      expect(nodeEl('A').querySelector('.react-flow__handle-right.source')).not.toBeNull();
    });

    it('lays a DAG out in layers', async () => {
      const dag = [card('a', 0, 0), card('b', 0, 0), card('c', 0, 0)];
      const edges: Edge[] = [
        { id: 'ac', source: 'a', target: 'c' },
        { id: 'bc', source: 'b', target: 'c' },
      ];
      await renderReady(<Controlled layout="left-right" initialNodes={dag} initialEdges={edges} />);
      expect(transformOf('C')).toBe(`translate(${W + 80}px,${(H + 24) / 2}px)`);
    });

    it('lays a mind map out radially', async () => {
      await renderReady(<Controlled layout="mind-map" initialNodes={tree} initialEdges={treeEdges} />);
      expect(transformOf('ROOT')).toBe(`translate(${-W / 2}px,${-H / 2}px)`);
      expect(document.querySelector('.nx-diagram')).toHaveAttribute('data-layout', 'mind-map');
      // A handle on every side; each edge leaves from the side facing its target.
      expect(nodeEl('ROOT').querySelectorAll('.react-flow__handle')).toHaveLength(8);
      const handlesOf = (id: string) => {
        const g = document.querySelector(`[data-testid="rf__edge-${id}"]`)!;
        return g.getAttribute('aria-label');
      };
      expect(handlesOf('ra')).toBeTruthy();
      expect(document.querySelectorAll('.react-flow__edge-path')).toHaveLength(2);
    });

    it('points mind-map edges at facing handles, also for uncontrolled edges', async () => {
      const edges: Edge[] = [...treeEdges, { id: 'own', source: 'a', target: 'b', sourceHandle: 's-top', targetHandle: 't-top' }];
      let api: ReturnType<typeof useReactFlow> | undefined;
      function Probe() {
        api = useReactFlow();
        return null;
      }
      render(
        <ReactFlowProvider>
          <DiagramCanvas aria-label="Map" layout="mind-map" defaultNodes={tree} defaultEdges={edges} />
          <Probe />
        </ReactFlowProvider>,
      );
      await waitFor(() => expect(nodeEl('A')).toBeInTheDocument());
      const byId = Object.fromEntries(api!.getEdges().map((e) => [e.id, e]));
      expect(byId.ra).toMatchObject({ sourceHandle: 's-right', targetHandle: 't-left' });
      expect(byId.rb).toMatchObject({ sourceHandle: 's-left', targetHandle: 't-right' });
      expect(byId.own).toMatchObject({ sourceHandle: 's-top', targetHandle: 't-top' });
    });

    it('keeps keyboard moves as an offset until the structure changes', async () => {
      const onNodesChange = vi.fn();
      function WithAdd() {
        const [extra, setExtra] = React.useState(false);
        return (
          <>
            <button type="button" onClick={() => setExtra(true)}>
              Add
            </button>
            <Controlled key={extra ? 'more' : 'base'} layout="left-right" initialNodes={extra ? [...tree, card('c', 0, 0)] : tree} initialEdges={treeEdges} onNodesChange={onNodesChange} />
          </>
        );
      }
      await renderReady(<WithAdd />);
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowDown', altKey: true });
      await waitFor(() => expect(transformOf('A')).toBe(`translate(${W + 80}px,16px)`));
      fireEvent.click(screen.getByRole('button', { name: 'Add' }));
      await waitFor(() => expect(transformOf('A')).toBe(`translate(${W + 80}px,0px)`));
    });

    it('keeps moves even when the app does not store them', async () => {
      render(<DiagramCanvas aria-label="Laid out" layout="left-right" nodes={tree} edges={treeEdges} />);
      await waitFor(() => expect(nodeEl('A')).toBeInTheDocument());
      fireEvent.keyDown(nodeEl('A'), { key: 'ArrowRight', altKey: true });
      await waitFor(() => expect(transformOf('A')).toBe(`translate(${W + 80 + 16}px,0px)`));
    });

    it('lays uncontrolled defaultNodes out once', async () => {
      render(<DiagramCanvas aria-label="Uncontrolled" layout="left-right" defaultNodes={tree} defaultEdges={treeEdges} />);
      await waitFor(() => expect(transformOf('A')).toBe(`translate(${W + 80}px,0px)`));
      render(<DiagramCanvas aria-label="Uncontrolled plain" defaultNodes={[card('z', 5, 5)]} />);
      await waitFor(() => expect(transformOf('Z')).toBe('translate(5px,5px)'));
    });
  });

  it('uses a ReactFlowProvider above it', async () => {
    let api: ReturnType<typeof useReactFlow> | undefined;
    function Probe() {
      api = useReactFlow();
      return null;
    }
    render(
      <ReactFlowProvider>
        <DiagramCanvas aria-label="Shared" nodes={grid()} edges={[]} />
        <Probe />
      </ReactFlowProvider>,
    );
    await waitFor(() => expect(nodeEl('A')).toBeInTheDocument());
    expect(api!.getNodes().map((n) => n.id)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('turns fit-view animation off for reduced motion', async () => {
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    try {
      await renderReady(<Controlled fitView fitViewOptions={{ duration: 500 }} />);
      fireEvent.click(screen.getByRole('button', { name: 'Fit view' }));
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('DiagramNode outside DiagramCanvas', () => {
  it('renders under a plain ReactFlow with left/right handles and no connect button', async () => {
    const nodes: Node[] = [card('a', 0, 0)];
    render(
      <div style={{ width: 800, height: 600 }}>
        <ReactFlow nodes={nodes} edges={[]} nodeTypes={{ nexub: DiagramNode }} onConnect={(_c: Connection) => {}} onNodesChange={(_c: NodeChange[]) => {}} />
      </div>,
    );
    await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument());
    const el = document.querySelector('.react-flow__node-nexub')!;
    expect(el.querySelector('.react-flow__handle-left')).not.toBeNull();
    expect(el.querySelector('.react-flow__handle-right')).not.toBeNull();
    expect(el.querySelector('button')).toBeNull();
  });
});
