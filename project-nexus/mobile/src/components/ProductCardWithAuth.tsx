import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getMobileImageUrl } from '../utils/imageUrl';
import { addToCart } from '../store/slices/cartSlice';
import type { Product } from '../types/product';
import type { RootState, AppDispatch } from '../store';

interface ProductCardWithAuthProps {
  product: Product;
  onPress: () => void;
}

export function ProductCardWithAuth({ product, onPress }: ProductCardWithAuthProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add items to your cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/login' as any) }
        ]
      );
      return;
    }

    if (user?.role !== 'buyer') {
      Alert.alert(
        'Buyer Account Required',
        'Only buyer accounts can add items to cart.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (product.stock <= 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    Alert.alert('Success', 'Added to cart!', [
      {
        text: 'Continue Shopping',
        style: 'cancel'
      },
      {
        text: 'View Cart',
        onPress: () => router.push('/cart' as any)
      }
    ]);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: getMobileImageUrl(product.image) }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Stock indicator */}
        {product.stock <= 0 && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        
        <View style={styles.stockInfo}>
          <Text style={styles.stockLabel}>Stock: </Text>
          <Text style={[
            styles.stockValue,
            {
              color: product.stock > 10 
                ? '#10b981' 
                : product.stock > 0 
                ? '#f59e0b' 
                : '#ef4444'
            }
          ]}>
            {product.stock > 0 ? product.stock : 'Out of stock'}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.rating && (
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.addButton,
              product.stock <= 0 && styles.addButtonDisabled
            ]}
            onPress={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <Ionicons 
              name={product.stock <= 0 ? "close" : "add"} 
              size={20} 
              color="#ffffff" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: 4,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  stockValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButton: {
    backgroundColor: '#4f46e5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowColor: '#9ca3af',
  },
});
