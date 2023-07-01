import { createContext } from 'react';

interface AuthContext {
  username: string;
  role: 'manager' | 'worker';
  logout: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AuthContext = createContext<AuthContext>(undefined!);
