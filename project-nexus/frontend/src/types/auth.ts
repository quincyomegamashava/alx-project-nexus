// Authentication-related TypeScript interfaces for frontend

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'buyer' | 'seller';
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'buyer' | 'seller';
  phone?: string;
  address?: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
}