'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Package } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store';

export default function Navigation() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-indigo-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PN</span>
              </div>
              <span className="text-xl font-bold text-indigo-900">Project Nexus</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Products
            </Link>

            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-200 border-t-indigo-600"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : !isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                  </div>
                </Link>
                
                {user?.role === 'seller' && (
                  <Link
                    href="/add-product"
                    className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  >
                    Add Product
                  </Link>
                )}

                {/* Profile Link */}
                <Link
                  href="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Orders Link */}
                <Link
                  href="/orders"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  title="Order History"
                >
                  <Package className="h-5 w-5" />
                  <span className="hidden sm:inline">Orders</span>
                </Link>

                {user?.role === 'buyer' && (
                  <Link
                    href="/cart"
                    className="relative p-2 text-gray-700 hover:text-indigo-600 transition-all duration-200 hover:bg-indigo-50 rounded-lg group"
                    title={`Shopping Cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
                  >
                    <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}