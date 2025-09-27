import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RouteGuard from '../components/RouteGuard';
import type { RootState, AppDispatch } from '../store';
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from '../store/slices/cartSlice';

function CartContent() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);

  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(productId))
        }
      ]
    );
  };

  const handleIncreaseQuantity = (productId: string) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => dispatch(clearCart())
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to place an order',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => router.push('/login' as any)
          }
        ]
      );
      return;
    }

    if (user?.role !== 'buyer') {
      Alert.alert('Access Denied', 'Only buyers can place orders');
      return;
    }

    // Navigate to dedicated checkout screen
    router.push('/checkout' as any);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bag-outline" size={80} color="#9ca3af" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Start shopping to add items to your cart
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.subtitle}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </Text>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCart}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.itemPrice}>
                  ${item.price.toFixed(2)} each
                </Text>
                
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      item.quantity <= 1 && styles.quantityButtonDisabled
                    ]}
                    onPress={() => handleDecreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                  >
                    <Ionicons name="remove" size={16} color={item.quantity <= 1 ? "#9ca3af" : "#374151"} />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      item.quantity >= item.maxStock && styles.quantityButtonDisabled
                    ]}
                    onPress={() => handleIncreaseQuantity(item.id)}
                    disabled={item.quantity >= item.maxStock}
                  >
                    <Ionicons name="add" size={16} color={item.quantity >= item.maxStock ? "#9ca3af" : "#374151"} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.itemRight}>
                <Text style={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
                
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => router.replace('/(tabs)' as any)}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.checkoutButton,
              !isAuthenticated && styles.checkoutButtonDisabled
            ]}
            onPress={handleCheckout}
            disabled={!isAuthenticated}
          >
            <View style={styles.checkoutButtonContent}>
              <Ionicons name="card-outline" size={20} color="#ffffff" />
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {!isAuthenticated && (
          <Text style={styles.signInPrompt}>
            Please{' '}
            <Text
              style={styles.signInLink}
              onPress={() => router.push('/login' as any)}
            >
              sign in
            </Text>
            {' '}to checkout
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  clearButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#fafbff',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  continueShoppingButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  checkoutButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signInPrompt: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  signInLink: {
    color: '#4f46e5',
    textDecorationLine: 'underline',
  },
});

export default function CartScreen() {
  return (
    <RouteGuard requireAuth={true} requiredRole="buyer">
      <CartContent />
    </RouteGuard>
  );
}
