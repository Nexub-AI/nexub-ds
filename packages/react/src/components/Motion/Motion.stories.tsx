import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '../Button/index.js';
import { Card } from '../Card/index.js';
import { Skeleton } from '../Skeleton/index.js';
import { Fade } from './Fade.js';
import { Slide } from './Slide.js';
import { Scale } from './Scale.js';
import { Collapse } from './Collapse.js';
import { ListTransition, SkeletonSwap } from './ListTransition.js';

const meta: Meta = {
  title: 'Components/Motion',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const box: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: 'var(--shape-container)',
  background: 'var(--color-surface-container-high)',
  color: 'var(--color-on-surface)',
  width: 'fit-content',
};

/** Fade, Slide, Scale and Collapse on the spring tokens. Toggle to replay. */
export const Primitives: Story = {
  render: function Render() {
    const [shown, setShown] = React.useState(true);
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Button variant="tonal" onClick={() => setShown((v) => !v)} style={{ width: 'fit-content' }}>
          {shown ? 'Hide' : 'Show'}
        </Button>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', minHeight: 64 }}>
          <Fade in={shown}><div style={box}>Fade</div></Fade>
          <Slide in={shown} direction="up"><div style={box}>Slide up</div></Slide>
          <Scale in={shown}><div style={box}>Scale</div></Scale>
        </div>
        <Collapse in={shown}>
          <div style={box}>Collapse animates height on the spatial spring.</div>
        </Collapse>
      </div>
    );
  },
};

/** `nx-stagger`: children rise in 40ms apart. Replay re-keys the list. */
export const Stagger: Story = {
  render: function Render() {
    const [run, setRun] = React.useState(0);
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <Button variant="tonal" onClick={() => setRun((n) => n + 1)} style={{ width: 'fit-content' }}>
          Replay
        </Button>
        <div key={run} className="nx-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 160px)', gap: '0.75rem' }}>
          {['Balance', 'Income', 'Spend', 'Savings', 'Cards', 'Goals'].map((t) => (
            <Card key={t} style={{ padding: '1rem' }}>{t}</Card>
          ))}
        </div>
      </div>
    );
  },
};

/** Items grow in and collapse out; removed rows exit in place. */
export const List: Story = {
  render: function Render() {
    const [items, setItems] = React.useState(['Coffee · S$5.40', 'Grab · S$12.10', 'NTUC · S$48.75']);
    const [n, setN] = React.useState(1);
    return (
      <div style={{ display: 'grid', gap: '1rem', width: 320 }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="tonal" onClick={() => { setItems((l) => [`Transfer #${n} · S$${(n * 7.5).toFixed(2)}`, ...l]); setN((x) => x + 1); }}>
            Add
          </Button>
          <Button variant="outlined" onClick={() => setItems((l) => l.slice(1))} disabled={!items.length}>
            Remove first
          </Button>
        </div>
        <ListTransition as="ul" itemAs="li" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((t) => (
            <div key={t} style={{ paddingBlock: '0.25rem' }}>
              <div style={box}>{t}</div>
            </div>
          ))}
        </ListTransition>
      </div>
    );
  },
};

/** Skeleton crossfades to the content instead of popping. */
export const SkeletonToContent: Story = {
  render: function Render() {
    const [loading, setLoading] = React.useState(true);
    return (
      <div style={{ display: 'grid', gap: '1rem', width: 320 }}>
        <Button variant="tonal" onClick={() => setLoading((v) => !v)} style={{ width: 'fit-content' }}>
          {loading ? 'Finish loading' : 'Load again'}
        </Button>
        <SkeletonSwap
          loading={loading}
          skeleton={
            <div style={{ display: 'grid', gap: 8 }}>
              <Skeleton shape="line" width="60%" />
              <Skeleton shape="rect" height={64} />
            </div>
          }
        >
          <div style={{ display: 'grid', gap: 8 }}>
            <strong>Total balance</strong>
            <div style={box}>S$12,480.00</div>
          </div>
        </SkeletonSwap>
      </div>
    );
  },
};
