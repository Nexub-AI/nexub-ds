import { StepIndicator } from '@nexub/patterns';

export default function Example() {
  return (
    <StepIndicator
      currentStep={1}
      steps={[{ label: 'Account' }, { label: 'Profile' }, { label: 'Billing' }, { label: 'Done' }]}
    />
  );
}
