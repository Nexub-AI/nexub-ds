import { ErrorState } from '@nexub/react';

export default function Example() {
  return (
    <ErrorState
      title="Something went wrong"
      description="We could not load the data. Please try again."
      onRetry={() => {}}
    />
  );
}
