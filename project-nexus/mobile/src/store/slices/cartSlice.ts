import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  shippingAddress: ShippingAddress | null;
  paymentMethod: string;
  isCheckingOut: boolean;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  shippingAddress: null,
  paymentMethod: 'cash_on_delivery',
  isCheckingOut: false,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

const saveCartToStorage = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: any; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, existingItem.maxStock);
        existingItem.quantity = newQuantity;
      } else {
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image || '/images/default-product.png',
          quantity: Math.min(quantity, product.stock),
          maxStock: product.stock,
        };
        state.items.push(newItem);
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      
      // Save to AsyncStorage
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      
      // Save to AsyncStorage
      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item && quantity > 0 && quantity <= item.maxStock) {
        item.quantity = quantity;
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        
        // Save to AsyncStorage
        saveCartToStorage(state.items);
      }
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item && item.quantity < item.maxStock) {
        item.quantity += 1;
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        
        // Save to AsyncStorage
        saveCartToStorage(state.items);
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        
        // Save to AsyncStorage
        saveCartToStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.shippingAddress = null;
      state.paymentMethod = 'cash_on_delivery';
      state.isCheckingOut = false;
      
      // Clear from AsyncStorage
      saveCartToStorage([]);
    },

    loadCartFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload || [];
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },

    setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
    },

    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
    },

    setCheckingOut: (state, action: PayloadAction<boolean>) => {
      state.isCheckingOut = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  loadCartFromStorage,
  setShippingAddress,
  setPaymentMethod,
  setCheckingOut,
} = cartSlice.actions;

export default cartSlice.reducer;