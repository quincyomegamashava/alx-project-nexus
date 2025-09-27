import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product } from '../../types/product';

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://alx-project-nexus-production-4427.up.railway.app";

interface FilterOptions {
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

async function fetchProducts(options: FilterOptions = {}): Promise<Product[]> {
  const { category, sortBy, sortOrder, page = 1, limit = 20 } = options;
  const params: any = { _page: page, _limit: limit };
  
  if (category && category !== 'All') {
    params.category = category;
  }
  if (sortBy) {
    params._sort = sortBy;
    params._order = sortOrder || 'asc';
  }
  
  const res = await axios.get<Product[]>(`${API_URL}/api/products`, { params });
  return res.data;
}

export const loadProducts = createAsyncThunk(
  "products/load", 
  async (filters: FilterOptions = {}) => {
    return await fetchProducts(filters);
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { 
    items: [] as Product[], 
    status: "idle" as "idle" | "loading" | "succeeded" | "failed",
    error: null as string | null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load products";
      });
  }
});

export default productsSlice.reducer;
