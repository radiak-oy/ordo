import { createContext } from 'react';

interface AuthContext {
  username: string | null;
  role: 'manager' | 'worker' | null;
  logout: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AuthContext = createContext<AuthContext>(undefined!);
