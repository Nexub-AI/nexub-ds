import { Banner, Button } from '@nexub/react';

export default function Example() {
  return (
    <Banner
      tone="warning"
      action={<Button variant="outline" size="sm">Review now</Button>}
      onClose={() => {}}
    >
      Your payment method is expiring soon.
    </Banner>
  );
}
