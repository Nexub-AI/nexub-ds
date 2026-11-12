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

test('catalog parses every component; components removed in 3.0 are gone', () => {
  const catalog = loadCatalog();
  assert.ok(catalog.length > 50);
  assert.ok(catalog.some((c) => c.slug === 'stat-card' && c.package === '@nexub/patterns'));
  for (const slug of ['banner', 'callout', 'tag', 'status-pill']) assert.ok(!catalog.some((c) => c.slug === slug), slug);
});

test('prompts carry the request and the guidelines', async () => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '0' });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  const { prompts } = await client.listPrompts();
  assert.deepEqual(prompts.map((p) => p.name).sort(), ['build_screen', 'review_screen']);
  const build = await client.getPrompt({ name: 'build_screen', arguments: { screen: 'a billing page', platform: 'mobile' } });
  assert.match(build.messages[0].content.text, /^Build this React Native screen with @nexub\/react-native: a billing page/);
  assert.match(build.messages[0].content.text, /Calm Depth principles/);
  const review = await client.getPrompt({ name: 'review_screen', arguments: { code: '<div style={{color:"#f00"}} />' } });
  assert.match(review.messages[0].content.text, /```tsx\n<div style/);
  await client.close();
});

test('tools answer from the skill files', async () => {
  assert.match(await call('get_component', { name: 'StatCard' }), /^# StatCard/);
  assert.match(await call('get_component', { name: 'date' }), /Did you mean: .*date-picker/);
  assert.match(await call('list_components', { query: 'pricing' }), /plan-card/);
  assert.match(await call('get_tokens', { section: 'motion' }), /^## Motion/);
  assert.match(await call('get_guidelines'), /Calm Depth principles/);
  assert.match(await call('get_react_native'), /^# @nexub\/react-native/);
});

// 9.6: input limits, and lookups that can't leave the skill folder.
test('over-long or path-like input is refused, not read or echoed', async () => {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '0' });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  const long = 'a'.repeat(201);
  for (const [name, args] of [
    ['get_component', { name: long }],
    ['list_components', { query: long }],
    ['get_tokens', { section: long }],
  ]) {
    const res = await client.callTool({ name, arguments: args }).catch((e) => ({ isError: true, content: [{ text: String(e) }] }));
    assert.equal(res.isError, true, name);
    assert.ok(!res.content[0].text.includes(long), `${name} echoed the input`);
  }
  await assert.rejects(client.getPrompt({ name: 'build_screen', arguments: { screen: 'x', platform: 'desktop' } }));
  await assert.rejects(client.getPrompt({ name: 'review_screen', arguments: { code: 'x'.repeat(200_001) } }));
  await client.close();
  for (const name of ['../../package.json', '..%2f..%2fpackage.json', '/etc/passwd', 'components/button.md\0']) {
    assert.match(await call('get_component', { name }), /^No reference page for/, name);
  }
});
