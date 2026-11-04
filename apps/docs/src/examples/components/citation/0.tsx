import { Citation, SourceList, type CitationSource } from '@nexub/react';

const CITATION_SOURCES: CitationSource[] = [
  { title: 'Choosing a heat pump', url: 'https://example.com/guides/heat-pumps', snippet: 'Air-source pumps suit most homes with a garden or outside wall.' },
  { title: 'Grants for home heating', url: 'https://example.org/grants', domain: 'example.org' },
  { title: 'Running costs compared', url: 'https://example.net/costs' },
];

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch max-w-[560px]">
      <p>
        Most homes can use an air-source heat pump<Citation index={1} source={CITATION_SOURCES[0]!} />. Grants cover
        part of the cost<Citation index={2} source={CITATION_SOURCES[1]!} />, and running costs are close to gas
        <Citation index={3} source={CITATION_SOURCES[2]!} />.
      </p>
      <SourceList sources={CITATION_SOURCES} />
    </div>
  );
}
