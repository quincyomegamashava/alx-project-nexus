import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  rating?: number;
  description?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchProducts(page = 1, limit = 20): Promise<Product[]> {
  const res = await axios.get<Product[]>(`${API_URL}/products`, {
    params: { _page: page, _limit: limit },
  });
  return res.data;
}

export const loadProducts = createAsyncThunk("products/load", async () => {
  return await fetchProducts();
});

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