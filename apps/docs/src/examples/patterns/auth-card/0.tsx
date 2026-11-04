import { AuthCard } from '@nexub/patterns';
import { Label, Input, Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[360px]">
      <AuthCard title="Sign in" description="Welcome back — enter your credentials to continue.">
        <div className="flex flex-col gap-3 items-start">
          <div className="flex flex-col gap-1 items-start">
            <Label htmlFor="auth-email">Email</Label>
            <Input id="auth-email" type="email" placeholder="you@company.com" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <Label htmlFor="auth-pass">Password</Label>
            <Input id="auth-pass" type="password" placeholder="••••••••" />
          </div>
          <Button variant="primary" className="w-full">Sign in</Button>
        </div>
      </AuthCard>
    </div>
  );
}
