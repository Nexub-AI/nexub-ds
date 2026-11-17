// In-memory session for the demo app (/demo): nothing is stored, a reload signs you out.
import { createContext, use, useMemo, useState } from 'react';

interface DemoAuth {
  /** The email typed on the sign-in screen; kept through the code step. */
  email: string;
  signedIn: boolean;
  /** Step 1: remember who is signing in. */
  begin: (email: string) => void;
  /** Step 2: the code was accepted. */
  signIn: () => void;
  signOut: () => void;
}

const Context = createContext<DemoAuth | null>(null);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  const value = useMemo<DemoAuth>(
    () => ({
      email,
      signedIn,
      begin: setEmail,
      signIn: () => setSignedIn(true),
      signOut: () => {
        setSignedIn(false);
        setEmail('');
      },
    }),
    [email, signedIn],
  );
  return <Context value={value}>{children}</Context>;
}

export function useDemoAuth(): DemoAuth {
  const auth = use(Context);
  if (!auth) throw new Error('useDemoAuth must be used under /demo');
  return auth;
}
