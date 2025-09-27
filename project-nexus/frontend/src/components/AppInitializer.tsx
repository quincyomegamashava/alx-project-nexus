'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../store/slices/authSlice';
import type { AppDispatch } from '../store';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      // Check if user is stored in localStorage (client-side only)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          dispatch(getCurrentUser()).catch(error => {
            console.error('Failed to load user from token:', error);
          });
        }
      }
      // Set initialized after a short delay to ensure Redux store is ready
      setTimeout(() => setIsInitialized(true), 100);
    };

    initializeAuth();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
