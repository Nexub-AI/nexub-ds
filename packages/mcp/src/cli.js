#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer, skillAvailable } from './server.js';

if (!skillAvailable()) {
  console.error('@nexub/mcp: dist/skill is missing. In the monorepo, run `pnpm --filter @nexub/mcp build` first.');
  process.exit(1);
}
await createServer().connect(new StdioServerTransport());
