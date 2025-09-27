'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { RootState } from '../../store';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-indigo-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-indigo-600">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                  <p className="text-indigo-100 text-lg capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                    <span className="text-gray-900 capitalize">
                      {user?.role} 
                      <span className="ml-2">
                        {user?.role === 'seller' ? '🏪' : '🛍️'}
                      </span>
                    </span>
                  </div>
                </div>

                {user?.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                      <span className="text-gray-900">{user.phone}</span>
                    </div>
                  </div>
                )}

                {user?.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                      <span className="text-gray-900">{user.address}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                    <span className="text-gray-900">
                      {new Date(user?.createdAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button 
                  onClick={() => router.push('/profile/edit')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Edit Profile
                </button>
                
                {user?.role === 'seller' && (
                  <button 
                    onClick={() => router.push('/add-product')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Add Product
                  </button>
                )}
                
                {user?.role === 'buyer' && (
                  <>
                    <button 
                      onClick={() => router.push('/orders')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      View Orders
                    </button>
                    <button 
                      onClick={() => router.push('/cart')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      View Cart
                    </button>
                  </>
                )}
                
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}