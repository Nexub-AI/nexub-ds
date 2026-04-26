import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { SettingsSection } from './SettingsSection.js';

describe('SettingsSection', () => {
  it('renders title as h2', () => {
    render(
      <SettingsSection title="Profile">
        <input placeholder="Name" />
      </SettingsSection>,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe('Profile');
  });

  it('renders description when provided', () => {
    render(
      <SettingsSection title="Profile" description="Update your profile details.">
        <span>content</span>
      </SettingsSection>,
    );
    expect(screen.getByText('Update your profile details.')).toBeDefined();
  });

  it('does not render description element when omitted', () => {
    render(
      <SettingsSection title="Profile">
        <span>content</span>
      </SettingsSection>,
    );
    expect(screen.queryByText('Update your profile details.')).toBeNull();
  });

  it('renders children', () => {
    render(
      <SettingsSection title="Billing">
        <span data-testid="child-content">Card form here</span>
      </SettingsSection>,
    );
    expect(screen.getByTestId('child-content')).toBeDefined();
  });

  it('renders actions when provided', () => {
    render(
      <SettingsSection
        title="Security"
        actions={<button data-testid="save-btn">Save</button>}
      >
        <span>settings content</span>
      </SettingsSection>,
    );
    expect(screen.getByTestId('save-btn')).toBeDefined();
  });

  it('does not render actions container when omitted', () => {
    const { container } = render(
      <SettingsSection title="Notifications">
        <span>content</span>
      </SettingsSection>,
    );
    expect(container.querySelectorAll('button').length).toBe(0);
  });

  it('forwards className to root element', () => {
    const { container } = render(
      <SettingsSection title="API" className="custom-section">
        <span>content</span>
      </SettingsSection>,
    );
    expect(container.firstElementChild?.classList.contains('custom-section')).toBe(true);
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <SettingsSection title="Team" ref={ref}>
        <span>content</span>
      </SettingsSection>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
  });
});
