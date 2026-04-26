import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AvatarGroup } from './AvatarGroup.js';
import { Avatar } from '../Avatar/Avatar.js';

describe('AvatarGroup', () => {
  it('renders all children when max is not set', () => {
    render(
      <AvatarGroup>
        <Avatar name="Alice Smith" />
        <Avatar name="Bob Jones" />
        <Avatar name="Carol White" />
      </AvatarGroup>,
    );
    expect(screen.getByText('AS')).toBeInTheDocument();
    expect(screen.getByText('BJ')).toBeInTheDocument();
    expect(screen.getByText('CW')).toBeInTheDocument();
  });

  it('limits visible avatars to max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Alice Smith" />
        <Avatar name="Bob Jones" />
        <Avatar name="Carol White" />
      </AvatarGroup>,
    );
    expect(screen.getByText('AS')).toBeInTheDocument();
    expect(screen.getByText('BJ')).toBeInTheDocument();
    expect(screen.queryByText('CW')).not.toBeInTheDocument();
  });

  it('shows overflow count when max is exceeded', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Alice Smith" />
        <Avatar name="Bob Jones" />
        <Avatar name="Carol White" />
      </AvatarGroup>,
    );
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(
      <AvatarGroup className="custom-class">
        <Avatar name="Alice Smith" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('group')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AvatarGroup ref={ref}>
        <Avatar name="Alice Smith" />
      </AvatarGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
