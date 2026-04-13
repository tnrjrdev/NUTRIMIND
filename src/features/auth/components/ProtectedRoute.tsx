import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../../../services/api';
import { clearAuthSession, getAuthToken, setStoredUser } from '../utils/session';

export function ProtectedRoute() {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>(() =>
    getAuthToken() ? 'checking' : 'unauthenticated'
  );

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    let isMounted = true;

    api
      .get('/admin/me')
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setStoredUser(response.data.user);
        setStatus('authenticated');
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearAuthSession();
        setStatus('unauthenticated');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-4">
        <div className="rounded-[28px] bg-white px-8 py-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.1)] ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b78b03]">nutrimind</p>
          <p className="mt-3 text-sm text-slate-500">Verificando sua sessao...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
