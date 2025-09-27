import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RouteGuard from '../components/RouteGuard';
import { getMobileImageUrl } from '../utils/imageUrl';
import type { RootState } from '../store';

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  shippingInfo: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
}

function OrderHistoryContent() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.103.80:4000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setOrders([]);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);

    } catch (error: any) {
      console.error('Error fetching orders:', error);
      // For demo purposes, create mock orders if API fails
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          items: [
            { productId: '1', title: 'Wireless Headphones', price: 99.99, quantity: 1, image: 'images/headphones.jpeg' },
            { productId: '2', title: 'Bluetooth Speaker', price: 49.99, quantity: 2, image: 'images/phone.jpeg' }
          ],
          totals: {
            subtotal: 199.97,
            shipping: 10.99,
            tax: 15.98,
            total: 226.94
          },
          shippingInfo: {
            fullName: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            zipCode: '10001',
            country: 'United States'
          },
          status: 'delivered',
          createdAt: '2025-09-20T10:30:00Z',
          estimatedDelivery: '2025-09-25T17:00:00Z'
        },
        {
          id: 'ORD-002',
          items: [
            { productId: '3', title: 'Running Shoes', price: 129.99, quantity: 1, image: 'images/shoes.jpeg' }
          ],
          totals: {
            subtotal: 129.99,
            shipping: 10.99,
            tax: 10.40,
            total: 151.38
          },
          shippingInfo: {
            fullName: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            zipCode: '10001',
            country: 'United States'
          },
          status: 'shipped',
          createdAt: '2025-09-25T14:15:00Z',
          estimatedDelivery: '2025-09-28T17:00:00Z'
        }
      ];
      setOrders(mockOrders);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'time-outline';
      case 'shipped':
        return 'car-outline';
      case 'delivered':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'time-outline';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return '#f59e0b';
      case 'shipped':
        return '#3b82f6';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToOrders}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>

        {/* Order Info Card */}
        <View style={styles.detailCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Order #{selectedOrder.id}</Text>
              <Text style={styles.orderDate}>
                Placed on {formatDate(selectedOrder.createdAt)}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <Ionicons 
                name={getStatusIcon(selectedOrder.status) as any} 
                size={24} 
                color={getStatusColor(selectedOrder.status)} 
              />
              <Text style={[styles.statusText, { color: getStatusColor(selectedOrder.status) }]}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </Text>
            </View>
          </View>

          {selectedOrder.estimatedDelivery && (
            <View style={styles.deliveryInfo}>
              <Ionicons name="car-outline" size={20} color="#3b82f6" />
              <Text style={styles.deliveryText}>
                Est. delivery: {formatDate(selectedOrder.estimatedDelivery)}
              </Text>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {selectedOrder.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Image
                source={{ uri: getMobileImageUrl(item.image || 'images/placeholder.png') }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDetails}>
                  Quantity: {item.quantity} • ${item.price.toFixed(2)} each
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressName}>{selectedOrder.shippingInfo.fullName}</Text>
            <Text style={styles.addressText}>{selectedOrder.shippingInfo.address}</Text>
            <Text style={styles.addressText}>
              {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.zipCode}
            </Text>
            <Text style={styles.addressText}>{selectedOrder.shippingInfo.country}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${selectedOrder.totals.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${selectedOrder.totals.shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${selectedOrder.totals.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${selectedOrder.totals.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchOrders}
        >
          <Ionicons name="refresh-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="receipt-outline" size={80} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyMessage}>You haven't placed any orders yet.</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/products' as any)}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.ordersList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => handleOrderPress(order)}
              activeOpacity={0.7}
            >
              {/* Order Header */}
              <View style={styles.cardHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderCardId}>Order #{order.id}</Text>
                  <Text style={styles.orderCardDate}>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>
                <View style={styles.orderMeta}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(order.status) }]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.orderTotal}>${order.totals.total.toFixed(2)}</Text>
                </View>
              </View>

              {/* Order Items Preview */}
              <View style={styles.itemsPreview}>
                <View style={styles.itemImagesContainer}>
                  {order.items.slice(0, 3).map((item, index) => (
                    <Image
                      key={index}
                      source={{ uri: getMobileImageUrl(item.image || 'images/placeholder.png') }}
                      style={[styles.previewImage, { marginLeft: index > 0 ? -8 : 0 }]}
                      resizeMode="cover"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <View style={styles.moreItemsIndicator}>
                      <Text style={styles.moreItemsText}>+{order.items.length - 3}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.itemsSummary}>
                  <Text style={styles.itemsCount}>
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
              </View>

              {/* Delivery Info */}
              {order.estimatedDelivery && order.status === 'shipped' && (
                <View style={styles.deliveryBanner}>
                  <Ionicons name="car" size={16} color="#3b82f6" />
                  <Text style={styles.deliveryBannerText}>
                    Est. delivery: {formatDate(order.estimatedDelivery)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default function OrderHistoryScreen() {
  return (
    <RouteGuard requireAuth={true}>
      <OrderHistoryContent />
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  refreshButton: {
    padding: 8,
  },
  centerContainer: {
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  orderInfo: {
    flex: 1,
  },
  orderCardId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  orderCardDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  itemsPreview: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  moreItemsIndicator: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  moreItemsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  itemsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemsCount: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  deliveryBanner: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryBannerText: {
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 8,
    fontWeight: '500',
  },
  // Detail view styles
  detailCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  deliveryInfo: {
    backgroundColor: '#dbeafe',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  addressContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
});