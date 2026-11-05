import { FAQ, SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <FAQ
        header={<SectionHeader title="Questions" />}
        items={[
          { question: 'Which countries do you support?', answer: 'Singapore, India, Indonesia, Malaysia and Vietnam.' },
          { question: 'Can I switch plans later?', answer: 'Yes, at any time. We prorate the difference.' },
          { question: 'Is my data secure?', answer: 'Data is encrypted at rest and in transit, and stored in the region you choose.' },
        ]}
      />
    </div>
  );
}
