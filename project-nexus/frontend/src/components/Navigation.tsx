'use client';

import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Package, Settings, Home, ShoppingBag, LogOut } from 'lucide-react';
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
    <nav className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">PN</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Project Nexus
                </span>
                <span className="text-xs text-gray-500 font-medium">E-Commerce Platform</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-indigo-50 group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-indigo-50 group"
            >
              <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Products</span>
            </Link>

            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-indigo-200 border-t-indigo-600"></div>
                <span className="text-sm text-gray-500 font-medium">Loading...</span>
              </div>
            ) : !isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {user?.role === 'seller' && (
                  <Link
                    href="/add-product"
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-indigo-50 group"
                  >
                    <Package className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Add Product</span>
                  </Link>
                )}

                {/* Orders Link */}
                <Link
                  href="/orders"
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-indigo-50 group"
                  title="Order History"
                >
                  <Package className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Orders</span>
                </Link>

                {/* Cart Link - Only for buyers */}
                {user?.role === 'buyer' && (
                  <Link
                    href="/cart"
                    className="relative p-3 text-gray-600 hover:text-indigo-600 transition-all duration-200 hover:bg-indigo-50 rounded-xl group"
                    title={`Shopping Cart${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
                  >
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                  </Link>
                )}

                {/* Settings Link */}
                <Link
                  href="/settings"
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-indigo-50 group"
                  title="Settings"
                >
                  <Settings className="h-4 w-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-200" />
                  <span className="hidden lg:inline">Settings</span>
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <Link href="/profile" className="flex items-center space-x-3 hover:bg-gray-50 rounded-2xl px-4 py-2 transition-all duration-200 group border border-gray-200 hover:border-indigo-300 hover:shadow-md">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col items-start hidden sm:flex">
                      <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                      <span className="text-xs text-gray-500 capitalize font-medium">{user?.role}</span>
                    </div>
                  </Link>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-600 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-50 group"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}