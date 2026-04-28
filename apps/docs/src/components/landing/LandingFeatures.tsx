'use client';

import { motion } from 'framer-motion';
import { componentEntries, patternEntries } from '@/registry/index';

const features = [
  {
    icon: '◈',
    stat: `${componentEntries.length}`,
    title: 'Components',
    desc: 'Accessible, token-driven React components built on Radix UI primitives. Every edge case handled.',
  },
  {
    icon: '⬡',
    stat: '100%',
    title: 'TypeScript',
    desc: 'Fully typed from props to theme tokens. Autocomplete, type safety, zero any-casting.',
  },
  {
    icon: '◐',
    stat: '5',
    title: 'Brand themes',
    desc: 'Light, dark, and 4 product brands (Leap, Bookub, Payub, Founderub) — all CSS, zero runtime.',
  },
  {
    icon: '⊞',
    stat: `${patternEntries.length}`,
    title: 'Patterns',
    desc: 'Composable UI patterns for real SaaS flows: stat cards, auth, settings, activity feeds.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export function LandingFeatures() {
  return (
    <section
      style={{
        background: 'var(--color-bg-subtle)',
        borderTop: '1px solid var(--color-border-default)',
        borderBottom: '1px solid var(--color-border-default)',
        padding: '5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-brand-primary-500)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            textAlign: 'center',
          }}
        >
          What&apos;s inside
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            marginBottom: '3rem',
            color: 'var(--color-text-primary)',
          }}
        >
          Everything you need to ship faster
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -4, boxShadow: 'var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.12))' }}
              viewport={{ once: true, margin: '-60px' }}
              style={{
                background: 'var(--color-bg-raised)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'default',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-semantic-info-bg)',
                  border: '1px solid var(--color-semantic-info-border)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--color-brand-primary-500)',
                }}
              >
                {f.icon}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary-500)', lineHeight: 1, marginBottom: '0.25rem' }}>
                {f.stat}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                {f.title}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {f.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
