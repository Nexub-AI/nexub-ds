import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'auth-card',
    title: 'AuthCard',
    description: 'Authentication layout pattern. Wraps sign-in, sign-up, and reset flows in a centered card.',
    category: 'Auth',
    package: '@nexub/patterns',
    status: 'stable',
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Card heading (e.g. "Sign in to Nexub").' },
    { name: 'description', type: 'string', required: false, description: 'Subheading text.' },
    { name: 'logo', type: 'React.ReactNode', required: false, description: 'Logo or brand mark above the title.' },
    { name: 'footer', type: 'React.ReactNode', required: false, description: 'Footer content (e.g. "Don\'t have an account?").' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Form content.' },
  ],
  examples: [
    {
      title: 'Sign in',
      code: `<AuthCard
  title="Sign in to Nexub"
  description="Enter your credentials below"
  footer={<Text size="sm">Don't have an account? <Link href="/signup">Sign up</Link></Text>}
>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Input type="email" placeholder="Email" />
    <Input type="password" placeholder="Password" />
    <Button>Sign in</Button>
  </div>
</AuthCard>`,
    },
  ],
};

export default entry;
