import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanSource } from './nexub-usage.mjs';

test('reads named, aliased, type and multi-line @nexub imports; ignores others', () => {
  const src = `
    import { Button, Card as Panel } from '@nexub/react';
    import type { Size } from "@nexub/react";
    import {
      AuthCard,
      type PlanCardProps,
    } from '@nexub/patterns';
    import { useState } from 'react';
  `;
  assert.deepEqual(scanSource(src), [
    { pkg: '@nexub/react', name: 'Button' },
    { pkg: '@nexub/react', name: 'Card' },
    { pkg: '@nexub/react', name: 'Size' },
    { pkg: '@nexub/patterns', name: 'AuthCard' },
    { pkg: '@nexub/patterns', name: 'PlanCardProps' },
  ]);
});
