'use client';

import * as React from 'react';

type Brand = 'base' | 'leap' | 'bookub' | 'payub' | 'founderub';

const brands: { value: Brand; label: string; color: string }[] = [
  { value: 'base',      label: 'Base',      color: '#4099f1' },
  { value: 'leap',      label: 'Leap',      color: '#6366f1' },
  { value: 'bookub',    label: 'Bookub',    color: '#10b981' },
  { value: 'payub',     label: 'Payub',     color: '#8b5cf6' },
  { value: 'founderub', label: 'Founderub', color: '#f59e0b' },
];

const STORAGE_KEY = 'nexub-brand';

export function BrandSwitcher() {
  const [brand, setBrand] = React.useState<Brand>('base');

  // Read from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Brand | null;
    if (stored && brands.some((b) => b.value === stored)) {
      applyBrand(stored);
      setBrand(stored);
    }
  }, []);

  const applyBrand = (b: Brand) => {
    const root = document.documentElement;
    if (b === 'base') {
      root.removeAttribute('data-product');
    } else {
      root.setAttribute('data-product', b);
    }
    localStorage.setItem(STORAGE_KEY, b);
  };

  const handleSelect = (b: Brand) => {
    applyBrand(b);
    setBrand(b);
  };

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginRight: '2px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Brand</span>
      {brands.map((b) => (
        <button
          key={b.value}
          onClick={() => handleSelect(b.value)}
          title={b.label}
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: b.color,
            border: brand === b.value ? `2px solid var(--color-text-primary)` : '2px solid transparent',
            outline: brand === b.value ? `2px solid ${b.color}` : 'none',
            outlineOffset: '1px',
            cursor: 'pointer',
            transition: 'border var(--duration-fast) var(--ease-out)',
            padding: 0,
          }}
          aria-pressed={brand === b.value}
          aria-label={b.label}
        />
      ))}
    </div>
  );
}
