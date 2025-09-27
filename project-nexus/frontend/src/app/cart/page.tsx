'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import RouteGuard from '../../components/RouteGuard';
import type { RootState, AppDispatch } from '../../store';
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from '../../store/slices/cartSlice';

function CartContent() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncreaseQuantity = (productId: string) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'buyer') {
      alert('Only buyers can place orders');
      return;
    }

    // Navigate to dedicated checkout page
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-4 text-lg text-gray-600">
              Start shopping to add items to your cart
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Items</h2>
              <button
                onClick={() => dispatch(clearCart())}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-12 text-center font-medium">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleIncreaseQuantity(item.id)}
                    disabled={item.quantity >= item.maxStock}
                    className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={handleCheckout}
                disabled={!isAuthenticated}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Checkout
              </button>
            </div>

            {!isAuthenticated && (
              <p className="mt-3 text-sm text-gray-600 text-center">
                Please{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-indigo-600 hover:text-indigo-800 underline"
                >
                  sign in
                </button>
                {' '}to checkout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <RouteGuard requireAuth={true} requiredRole="buyer">
      <CartContent />
    </RouteGuard>
  );
}
