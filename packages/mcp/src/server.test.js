// Needs `pnpm --filter @nexub/mcp build` (turbo runs build before test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer, loadCatalog } from './server.js';

const call = async (name, args = {}) => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '0' });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  const res = await client.callTool({ name, arguments: args });
  await client.close();
  return res.content[0].text;
};

test('catalog parses every component and flags deprecations', () => {
  const catalog = loadCatalog();
  assert.ok(catalog.length > 50);
  assert.ok(catalog.some((c) => c.slug === 'stat-card' && c.package === '@nexub/patterns'));
  assert.ok(catalog.find((c) => c.slug === 'tag')?.deprecated);
});

test('tools answer from the skill files', async () => {
  assert.match(await call('get_component', { name: 'StatCard' }), /^# StatCard/);
  assert.match(await call('get_component', { name: 'date' }), /Did you mean: .*date-picker/);
  assert.match(await call('list_components', { query: 'pricing' }), /plan-card/);
  assert.match(await call('get_tokens', { section: 'motion' }), /^## Motion/);
  assert.match(await call('get_guidelines'), /Calm Depth principles/);
});
