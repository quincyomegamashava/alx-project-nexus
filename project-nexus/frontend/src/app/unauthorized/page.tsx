'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-2">
          You don't have permission to access this resource.
        </p>
        
        {user && (
          <p className="text-sm text-gray-500 mb-8">
            Signed in as <span className="font-medium">{user.name}</span> ({user.role})
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}