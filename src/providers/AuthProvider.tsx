import React, { useState, useEffect } from 'react';

import AuthContext from '../context/AuthContext';
import { AuthUser, useAuthUser } from '../api/authApi';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { data, isLoading } = useAuthUser();

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setAuthUser(data);
      }

      setLoading(false);
    }
  }, [data, isLoading]);

  return <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
