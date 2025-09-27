'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '../store';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'buyer' | 'seller';
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function RouteGuard({
  children,
  requireAuth = false,
  requiredRole,
  redirectTo = '/login',
  fallback
}: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      // Skip check if auth is still loading
      if (isLoading) {
        return;
      }

      // Check authentication requirement
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role requirement
      if (requiredRole && user?.role !== requiredRole) {
        if (!isAuthenticated) {
          router.push(redirectTo);
        } else {
          // User is authenticated but wrong role
          router.push('/unauthorized');
        }
        return;
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [isAuthenticated, user?.role, isLoading, requireAuth, requiredRole, redirectTo, router]);

  // Show loading while checking auth or redirecting
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show fallback if access is denied and user is authenticated (wrong role)
  if (requireAuth && isAuthenticated && requiredRole && user?.role !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
}