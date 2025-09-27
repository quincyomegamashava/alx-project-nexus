'use client';

import { Lock, Shield } from 'lucide-react';

interface ProtectedRouteIndicatorProps {
  requiredRole?: 'buyer' | 'seller';
  className?: string;
}

export default function ProtectedRouteIndicator({ 
  requiredRole, 
  className = '' 
}: ProtectedRouteIndicatorProps) {
  return (
    <div className={`inline-flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ${className}`}>
      {requiredRole ? (
        <>
          <Shield className="h-3 w-3" />
          <span className="capitalize">{requiredRole}s Only</span>
        </>
      ) : (
        <>
          <Lock className="h-3 w-3" />
          <span>Auth Required</span>
        </>
      )}
    </div>
  );
}