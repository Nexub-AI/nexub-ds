import { HowItWorks, SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <HowItWorks
        header={<SectionHeader title="Up and running in a day" />}
        steps={[
          { title: 'Create your account', description: 'Sign up with your company details.' },
          { title: 'Invite your team', description: 'Add people and their bank details.' },
          { title: 'Run your first payroll', description: 'Review, approve and pay.' },
        ]}
      />
    </div>
  );
}
