import type { PropDef } from '@/registry/types';

interface PropsTableProps {
  props: PropDef[];
}

export function PropsTable({ props }: PropsTableProps) {
  if (!props.length) return null;

  return (
    <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8125rem',
          lineHeight: 1.5,
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border-default)' }}>
            {['Prop', 'Type', 'Default', 'Required', 'Description'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                  background: 'var(--color-bg-subtle)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p, i) => (
            <tr
              key={p.name}
              style={{
                borderBottom: i < props.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
              }}
            >
              <td style={{ padding: '8px 12px', fontFamily: 'var(--font-family-mono)', fontWeight: 600, color: 'var(--color-brand-primary-500)', whiteSpace: 'nowrap' }}>
                {p.name}
              </td>
              <td style={{ padding: '8px 12px', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                {p.type}
              </td>
              <td style={{ padding: '8px 12px', fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-subtle)', fontSize: '0.75rem' }}>
                {p.default ?? '—'}
              </td>
              <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                {p.required ? (
                  <span style={{ color: 'var(--color-semantic-error-default)', fontWeight: 600 }}>✓</span>
                ) : (
                  <span style={{ color: 'var(--color-text-subtle)' }}>—</span>
                )}
              </td>
              <td style={{ padding: '8px 12px', color: 'var(--color-text-secondary)' }}>
                {p.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
