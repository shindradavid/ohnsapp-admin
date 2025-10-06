import { createContext } from 'react';

import { AuthUser } from '../api/authApi';

type AuthContextType = {
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => {},
  loading: true,
});

export default AuthContext;
