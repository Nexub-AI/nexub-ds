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
const products = ['default', 'leap', 'bookub', 'payub', 'founderub'];

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

      <Note title="Beta">
        The variables follow the W3C Design Tokens format, but a designer has not yet tried importing them into a real
        Figma file. Until that test passes, treat this import as beta, and report anything that does not import
        cleanly (an alias that does not resolve, a missing mode) as an issue.
      </Note>

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

      <Section id="variables" title="Collections with aliases">
        <Prose>
          Since 12.6, <code>@nexub/tokens/figma/variables/</code> holds the same tokens as three collections that
          reference each other the way the CSS does: a role such as <code>color/primary</code> is an alias of a
          reference palette tone (<code>palette/primary/40</code>), not a copied hex. Change a primitive and every role
          that uses it follows. Values are the shipped (signature) ones, the same as <code>@nexub/tokens/native</code>.
        </Prose>
        <DocTable
          head={['Files', 'Collection', 'Holds']}
          mono={[0]}
          rows={[
            ['primitives.tokens.json', 'Primitives (one mode)', 'The reference palette (palette/<name>/<tone>), spacing, radius, shape, sizes and the type scale, in px'],
            ['product.<product>.tokens.json', 'Product (five modes: default, leap, bookub, payub, founderub)', 'The tertiary palette for each data-product, as aliases of Primitives'],
            ['color.<scheme>.<level>.tokens.json', 'Color (six modes: light and dark × standard, medium, high)', 'Every colour role as an alias of Primitives; the tertiary roles alias Product'],
          ]}
        />
        <List
          items={[
            <a key="p" href={`${CDN}/variables/primitives.tokens.json`}>variables/primitives.tokens.json</a>,
            ...products.map((p) => (
              <a key={p} href={`${CDN}/variables/product.${p}.tokens.json`}>variables/product.{p}.tokens.json</a>
            )),
            ...modes.map((m) => (
              <a key={m} href={`${CDN}/variables/color.${m}.tokens.json`}>variables/color.{m}.tokens.json</a>
            )),
          ]}
        />
        <List
          ordered
          items={[
            <>Open the <strong>Variables</strong> view, create a collection named exactly <strong>Primitives</strong> and drag <code>primitives.tokens.json</code> into it.</>,
            <>Create a collection named <strong>Product</strong> and drag in the five <code>product.*</code> files together: Figma makes one mode per file. Rename the modes after the products.</>,
            <>Create a collection named <strong>Color</strong> and drag in the six <code>color.*</code> files. Aliases link by collection and variable name, so import in this order and keep the three names.</>,
            <>Bind components to <code>color/*</code>. A frame&apos;s Color mode picks light, dark and contrast; its Product mode picks the brand.</>,
          ]}
        />
        <Prose>
          <strong>Updating.</strong> After a new <code>@nexub/tokens</code> release, right-click each mode, choose{' '}
          <strong>Import mode</strong> and pick the matching file from the new version: variables with the same name and
          type update in place and keep their bindings. When the changelog lists new tokens, import the files into fresh
          collections instead. Figma&apos;s native import needs a paid plan; on other plans, or if you already use Tokens
          Studio, load the resolved files above as token sets.
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
