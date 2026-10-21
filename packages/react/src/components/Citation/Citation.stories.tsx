import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Citation, SourceList, type CitationSource } from './Citation.js';

const meta: Meta = {
  title: 'AI/Citation',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const sources: CitationSource[] = [
  {
    title: 'Attention Is All You Need',
    url: 'https://arxiv.org/abs/1706.03762',
    snippet: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
  },
  {
    title: 'The Illustrated Transformer',
    url: 'https://jalammar.github.io/illustrated-transformer/',
    domain: 'jalammar.github.io',
    snippet: 'A visual walk through the Transformer model, one component at a time.',
  },
  {
    title: 'Transformer (deep learning architecture) — Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)',
    snippet: 'A transformer is a deep learning architecture based on the multi-head attention mechanism.',
  },
];

export const Default: Story = {
  render: () => (
    <div className="max-w-xl space-y-4 text-body-md text-[var(--color-on-surface)]">
      <p>
        The Transformer replaced recurrence with self-attention
        <Citation index={1} source={sources[0]!} />, which lets every token attend to every other token in a single
        step <Citation index={2} source={sources[1]!} />. It is now the backbone of most large language
        models <Citation index={3} source={sources[2]!} />.
      </p>
      <SourceList sources={sources} />
    </div>
  ),
};

export const UnsafeUrl: Story = {
  render: () => (
    <p className="text-body-md text-[var(--color-on-surface)]">
      A javascript: URL renders as plain text
      <Citation index={1} source={{ title: 'Not a link', url: 'javascript:alert(1)' }} />.
    </p>
  ),
};
