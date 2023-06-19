import { Navigate, Outlet } from 'react-router-dom';

import { ArticleContextProvider } from '@/context/ArticleContext';
import { useAuthContext } from '@/context/AuthContext';

import type { ReactElement } from 'react';

interface AuthGuardProps {
  children?: ReactElement;
}

const AuthGuard = ({ children = <Outlet /> }: AuthGuardProps) => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? (
    <ArticleContextProvider>{children}</ArticleContextProvider>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AuthGuard;
