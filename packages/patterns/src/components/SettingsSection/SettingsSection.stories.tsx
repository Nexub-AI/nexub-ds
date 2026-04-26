import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SettingsSection } from './SettingsSection.js';

const meta: Meta = {
  title: 'Patterns/SettingsSection',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  height: '36px',
  padding: '4px 12px',
  borderRadius: '6px',
  border: '1px solid var(--color-border-default)',
  background: 'var(--color-bg-default)',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '4px',
  color: 'var(--color-text-primary)',
};

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '800px', padding: '24px' }}>
      <SettingsSection
        title="Profile"
        description="Update your personal information and how others see you."
        actions={
          <>
            <button
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-default)',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--color-brand-primary-500, #6366f1)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Save changes
            </button>
          </>
        }
      >
        <div>
          <label htmlFor="display-name" style={labelStyle}>
            Display name
          </label>
          <input
            id="display-name"
            defaultValue="Alice Johnson"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            defaultValue="alice@nexub.io"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="bio" style={labelStyle}>
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Write a short bio…"
            style={{ ...inputStyle, height: 'auto', padding: '8px 12px', resize: 'vertical' }}
          />
        </div>
      </SettingsSection>
    </div>
  ),
};
