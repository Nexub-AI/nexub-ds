import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CheckList, CheckListItem } from './CheckList.js';

describe('CheckList', () => {
  it('renders items from items prop', () => {
    render(<CheckList items={['First item', 'Second item', 'Third item']} />);
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
    expect(screen.getByText('Third item')).toBeInTheDocument();
  });

  it('renders items from children', () => {
    render(
      <CheckList>
        <CheckListItem>Custom item</CheckListItem>
      </CheckList>,
    );
    expect(screen.getByText('Custom item')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<CheckList className="custom-class" items={['Item']} />);
    expect(screen.getByRole('list')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLUListElement>();
    render(<CheckList ref={ref} items={['Item']} />);
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });

  it('renders as an unordered list', () => {
    render(<CheckList items={['Item']} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders one list item per entry', () => {
    render(<CheckList items={['A', 'B', 'C']} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
