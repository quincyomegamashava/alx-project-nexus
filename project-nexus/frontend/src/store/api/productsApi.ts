import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../../../shared/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface ProductFilters {
  category?: string;
  sortBy?: 'price' | 'title' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductFilters>({
      query: ({ category, sortBy, sortOrder, page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams({
          _page: page.toString(),
          _limit: limit.toString(),
        });
        
        if (category) {
          params.append('category', category);
        }
        
        if (sortBy) {
          params.append('_sort', sortBy);
          params.append('_order', sortOrder || 'asc');
        }
        
        return `products?${params.toString()}`;
      },
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productsApi;