'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadCartFromStorage } from '../store/slices/cartSlice';
import type { AppDispatch } from '../store';

export default function CartInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          dispatch(loadCartFromStorage(cartItems));
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    }
  }, [dispatch]);

  return null;
}