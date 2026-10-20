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

// Stable, module-level helper — never recreated
function applyBrand(b: Brand) {
  const root = document.documentElement;
  if (b === 'base') {
    root.removeAttribute('data-product');
  } else {
    root.setAttribute('data-product', b);
  }
  localStorage.setItem(STORAGE_KEY, b);
}

// Wrapped in React.memo so DocsHeader re-renders (e.g. on route change) do
// not cascade down into this component when brand state hasn't changed.
export const BrandSwitcher = React.memo(function BrandSwitcher() {
  const [brand, setBrand] = React.useState<Brand>('base');

  // Read persisted brand from localStorage on mount only
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Brand | null;
    if (stored && brands.some((b) => b.value === stored)) {
      applyBrand(stored);
      setBrand(stored);
    }
  }, []);

  // Stable callback — applyBrand is module-level so no closure deps needed
  const handleSelect = React.useCallback((b: Brand) => {
    applyBrand(b);
    setBrand(b);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <span style={{ fontSize: 'var(--type-label-sm-size)', color: 'var(--color-on-surface-variant)', marginRight: '2px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Brand</span>
      {brands.map((b) => (
        <BrandButton
          key={b.value}
          brand={b}
          isActive={brand === b.value}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
});

BrandSwitcher.displayName = 'BrandSwitcher';

// Separate memoized sub-component so individual brand buttons don't re-render
// when an unrelated brand is selected (only the newly active + deactivated buttons update)
interface BrandButtonProps {
  brand: { value: Brand; label: string; color: string };
  isActive: boolean;
  onSelect: (b: Brand) => void;
}

const BrandButton = React.memo(function BrandButton({ brand: b, isActive, onSelect }: BrandButtonProps) {
  return (
    <button
      onClick={() => onSelect(b.value)}
      title={b.label}
      style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: b.color,
        border: isActive ? `2px solid var(--color-on-surface)` : '2px solid transparent',
        outline: isActive ? `2px solid ${b.color}` : 'none',
        outlineOffset: '1px',
        cursor: 'pointer',
        transition: 'border var(--duration-fast) var(--ease-out)',
        padding: 0,
      }}
      aria-pressed={isActive}
      aria-label={b.label}
    />
  );
});
