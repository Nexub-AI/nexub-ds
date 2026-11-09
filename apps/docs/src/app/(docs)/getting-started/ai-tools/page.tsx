import type { Metadata } from 'next';
import Link from 'next/link';
import { DocTable, List, PageIntro, Prose, Section } from '@/components/kit';
import { CodeBlock } from '@/components/docs/CodeBlock';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'AI tools and MCP',
  description: 'Give Claude Code, Cursor, VS Code or any AI tool the Nexub components, tokens and rules: the MCP server, the Claude Code plugin, llms.txt and a Markdown version of every page.',
};

const mcpJson = `{
  "mcpServers": {
    "nexub-ds": { "command": "npx", "args": ["-y", "@nexub/mcp"] }
  }
}`;

export default function AiToolsPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Getting started"
        title="AI tools and MCP"
        lead={
          <>
            AI coding tools build better UI when they know your design system. Nexub gives them the components, patterns,
            tokens and rules of the release you install, so they reach for <code>Button</code> and{' '}
            <code>--color-primary</code> instead of generic Tailwind and hex colours. Pick whichever way fits your tool;
            all of them are built from the same source as these docs.
          </>
        }
      />

      <Section id="mcp" title="MCP server">
        <Prose>
          <code>@nexub/mcp</code> is a Model Context Protocol server. It answers from the reference of the version it was
          published with, and is versioned with <code>@nexub/react</code>.
        </Prose>
        <h3>Claude Code</h3>
        <CodeBlock lang="bash" code={"claude mcp add nexub-ds -- npx -y @nexub/mcp"} />
        <h3>Cursor, Windsurf, VS Code and other clients</h3>
        <Prose>Add it to the client&apos;s <code>mcpServers</code> config:</Prose>
        <CodeBlock lang="json" code={mcpJson} />
        <h3>Tools</h3>
        <DocTable
          head={['Tool', 'Returns']}
          mono={[0]}
          rows={[
            ['get_guidelines', 'Setup, how to build a screen, Calm Depth, Liquid Glass and copy rules, and the review checklist'],
            ['list_components', 'Every component and pattern, optionally filtered, e.g. query "chart"'],
            ['get_component', 'Props, import, examples, when to use and accessibility for one component, e.g. name "BarChart"'],
            ['get_tokens', 'Colour roles, type, spacing, shape, elevation and motion, with the Tailwind utilities'],
            ['get_react_native', 'Mobile: @nexub/react-native setup, components, screen patterns and rules'],
          ]}
        />
      </Section>

      <Section id="plugin" title="Claude Code plugin">
        <Prose>
          The <code>nexub-ds</code> plugin ships the same content as a skill, so Claude Code loads the rules only when you
          build UI:
        </Prose>
        <CodeBlock lang="bash" code={`claude plugin marketplace add Nexub-AI/nexub-ds
claude plugin install nexub-ds@nexub`} />
      </Section>

      <Section id="files" title="llms.txt and Markdown pages">
        <List
          items={[
            <>
              <a href="/llms.txt">/llms.txt</a> is the index for language models (<a href="https://llmstxt.org">llmstxt.org</a>).
              It links each component and pattern to its Markdown version.
            </>,
            <>
              <a href="/llms-full.txt">/llms-full.txt</a> is everything in one file: the rules, tokens and every component.
              Paste it into a chat, or attach it to a project.
            </>,
            <>
              Every component and pattern page has a Markdown twin at the same URL plus <code>.md</code>, for example{' '}
              <a href="/components/button.md">/components/button.md</a>. Use <strong>Copy as Markdown</strong> at the top
              of a page to paste it into any AI chat.
            </>,
          ]}
        />
      </Section>

      <Section id="prompts" title="Prompts that work">
        <List
          items={[
            <>&ldquo;Build a billing settings page with Nexub: plan, payment method and invoices.&rdquo;</>,
            <>&ldquo;Add a revenue chart to this dashboard with the Nexub charts kit, monthly, this year against last year.&rdquo;</>,
            <>&ldquo;Review this screen against the Nexub checklist and fix anything that isn&apos;t a token or a Nexub component.&rdquo;</>,
            <>&ldquo;Theme this app for our brand colour #e4572e with a server-rendered stylesheet.&rdquo;</>,
          ]}
        />
        <Prose>
          Building chat or agent UI itself? See <Link href="/getting-started/ai-surfaces">Building AI surfaces</Link>.
        </Prose>
      </Section>
    </div>
  );
}
