import type { Metadata } from 'next';
import Link from 'next/link';
import { DocTable, List, Note, PageIntro, Prose, Section } from '@/components/kit';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Figma',
  description: 'Import the Nexub tokens into Figma as variables, with light, dark and contrast modes, from the same values as the code.',
};

const CDN = 'https://unpkg.com/@nexub/tokens@latest/dist/figma';
const modes = ['light.standard', 'dark.standard', 'light.medium', 'dark.medium', 'light.high', 'dark.high'];

export default function FigmaPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Getting started"
        title="Figma"
        lead={
          <>
            Designers and developers should pick from the same palette. <code>@nexub/tokens</code> ships its tokens as
            Figma variables in the W3C Design Tokens format, built from the same values as the CSS and React Native
            tokens, so a Figma library made from them cannot drift from the code.
          </>
        }
      />

      <Section id="files" title="The files">
        <DocTable
          head={['File', 'Becomes', 'Holds']}
          mono={[0]}
          rows={[
            ['color.<scheme>.<level>.tokens.json', 'Collection “Color”, one mode per file', 'Every colour role (primary, surface, on-surface…) and the four product brands, resolved to hex for light and dark at standard, medium and high contrast'],
            ['primitives.tokens.json', 'Collection “Primitives”', 'Spacing, radius, shape, control and icon sizes, and the type scale (size, line height, weight, letter spacing) as numbers in px'],
          ]}
        />
        <Prose>
          They are in the package at <code>node_modules/@nexub/tokens/dist/figma/</code>, or straight from npm:
        </Prose>
        <List
          items={[
            ...modes.map((m) => (
              <a key={m} href={`${CDN}/color.${m}.tokens.json`}>color.{m}.tokens.json</a>
            )),
            <a key="p" href={`${CDN}/primitives.tokens.json`}>primitives.tokens.json</a>,
          ]}
        />
      </Section>

      <Section id="import" title="Import into Figma">
        <List
          ordered
          items={[
            <>In your library file, open <strong>Local variables</strong> and choose <strong>Import variables</strong>.</>,
            <>Import <code>color.light.standard.tokens.json</code> as a new collection named <strong>Color</strong>, then add each other <code>color.*</code> file as a mode of that collection (Dark, Light high contrast, and so on).</>,
            <>Import <code>primitives.tokens.json</code> as a second collection named <strong>Primitives</strong>.</>,
            <>Bind your components to the role variables (<code>role/primary</code>, <code>role/on-surface</code>…), never to hex. Switching a frame&apos;s mode then shows dark and high contrast exactly as the code renders them.</>,
          ]}
        />
        <Prose>
          Using Tokens Studio instead? Load the same files as token sets, one set per mode.
        </Prose>
      </Section>

      <Section id="brand" title="Your own brand">
        <Prose>
          For a white-label theme, build it in the <Link href="/foundations/theme-builder">theme builder</Link> and use its
          Tokens (DTCG) export, which uses the same format. Import its light and dark documents as a Brand collection
          and point the accent roles (primary or tertiary) at those variables.
        </Prose>
      </Section>

      <Section id="status" title="What is next">
        <Note title="Code Connect needs the library">
          Figma Code Connect (showing the real <code>@nexub/react</code> code in Dev Mode) and an automated check that a
          Figma library still matches these tokens both need the Nexub Figma library file. They are planned once that
          library is published from these variables.
        </Note>
      </Section>
    </div>
  );
}
