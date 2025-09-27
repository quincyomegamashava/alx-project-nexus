import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserFromStorage } from '../store/slices/authSlice';
import { loadCartFromStorage } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';

interface AppInitializerProps {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: AppInitializerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load user from storage
        dispatch(loadUserFromStorage());
        
        // Load cart from storage
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          dispatch(loadCartFromStorage(cartItems));
        }
      } catch (error) {
        console.error('Failed to initialize app data:', error);
      }
    };
    
    initializeApp();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafbff' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return <>{children}</>;
}