'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from '../store/api/productsApi';
import { loadProducts } from '../store/slices/productsSlice';
import { ProductCard } from './ProductCard';
import type { ProductFilters } from '../store/api/productsApi';
import type { RootState, AppDispatch } from '../store';

const categories = ['All', 'Clothing', 'Shoes', 'Electronics'];
const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'title:asc', label: 'Name A-Z' },
  { value: 'title:desc', label: 'Name Z-A' },
  { value: 'price:asc', label: 'Price Low to High' },
  { value: 'price:desc', label: 'Price High to Low' },
  { value: 'rating:desc', label: 'Highest Rated' },
];

export function ProductList() {
  const [filters, setFilters] = useState<ProductFilters>({
    category: undefined,
    sortBy: undefined,
    sortOrder: undefined,
    page: 1,
    limit: 12,
  });

  const { data: products = [], isLoading, error } = useGetProductsQuery(filters);

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === 'All' ? undefined : category,
      page: 1,
    }));
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split(':') as [string, 'asc' | 'desc'];
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading products</h2>
          <p className="text-gray-600">Please make sure the API server is running on port 4000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Products</h1>
          <p className="text-indigo-700 text-lg">Discover amazing products curated just for you</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-indigo-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-indigo-900 mb-4">Filter Products</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Category
              </label>
              <select
                className="block w-full px-4 py-3 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-900"
                value={filters.category || 'All'}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Sort By
              </label>
              <select
                className="block w-full px-4 py-3 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-indigo-900"
                value={filters.sortBy ? `${filters.sortBy}:${filters.sortOrder}` : ''}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => console.log('Product clicked:', product.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {products.length > 0 && (
              <div className="flex justify-center items-center space-x-4 bg-white rounded-xl shadow-lg border border-indigo-200 p-6">
                <button
                  onClick={() => handlePageChange(filters.page! - 1)}
                  disabled={filters.page === 1}
                  className="px-6 py-3 text-sm font-medium text-indigo-600 bg-white border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Previous
                </button>
                
                <span className="px-6 py-3 text-sm font-semibold text-indigo-900 bg-indigo-50 rounded-lg">
                  Page {filters.page}
                </span>
                
                <button
                  onClick={() => handlePageChange(filters.page! + 1)}
                  disabled={products.length < filters.limit!}
                  className="px-6 py-3 text-sm font-medium text-indigo-600 bg-white border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            )}

            {/* No products message */}
            {products.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-indigo-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}