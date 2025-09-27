import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { loadProducts } from '../store/slices/productsSlice';
import { ProductCardWithAuth } from '../components/ProductCardWithAuth';
import { FilterBar } from '../components/FilterBar';
import type { Product } from '../types/product';

export function ProductListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status, error } = useSelector(
    (state: RootState) => state.products
  );
  const loading = status === 'loading';
  const [refreshing, setRefreshing] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(loadProducts(currentFilters));
    setRefreshing(false);
  };

  const handleProductPress = (product: Product) => {
    Alert.alert(
      product.title,
      product.description || 'No description available',
      [{ text: 'OK' }]
    );
  };

  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...currentFilters, ...newFilters };
    setCurrentFilters(updatedFilters);
    dispatch(loadProducts(updatedFilters));
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCardWithAuth product={item} onPress={() => handleProductPress(item)} />
  );


  const renderEmptyComponent = () => {
    if (loading && products.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No products found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error loading products</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Check your internet connection and try again
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FilterBar onFilterChange={handleFilterChange} />
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#4f46e5']}
          tintColor="#4f46e5"
        />
        }
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={products.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#fafbff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});