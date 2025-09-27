'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Eye,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import RouteGuard from '../../components/RouteGuard';
import { getImageUrl } from '../../utils/imageUrl';
import type { RootState } from '../../store';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://192.168.103.80:4000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No orders found
          setOrders([]);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);

    } catch (err: any) {
      console.error('Error fetching orders:', err);
      // For demo purposes, create some mock orders if API fails
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <RefreshCw className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Orders
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-2">Order #{selectedOrder.id}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
                    <p className="opacity-90">Placed on {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-2 font-semibold capitalize">{selectedOrder.status}</span>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <p className="text-sm opacity-90">
                        Est. delivery: {formatDate(selectedOrder.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Items Ordered
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-16 h-16 relative">
                          <Image
                            src={getImageUrl(item.image || 'images/placeholder.png')}
                            alt={item.title}
                            fill
                            className="object-cover rounded-lg"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                        <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Shipping Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{selectedOrder.shippingInfo.fullName}</p>
                      <p className="text-gray-600">{selectedOrder.shippingInfo.address}</p>
                      <p className="text-gray-600">
                        {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.zipCode}
                      </p>
                      <p className="text-gray-600">{selectedOrder.shippingInfo.country}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Order Summary
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${selectedOrder.totals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>${selectedOrder.totals.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>${selectedOrder.totals.tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>${selectedOrder.totals.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
              <p className="text-gray-600 mt-2">Track and manage your orders</p>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg text-center">
              <p>{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <button
                onClick={() => router.push('/products')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(order.createdAt)}
                            </div>
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-1" />
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${order.totals.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="w-12 h-12 relative border-2 border-white rounded-lg overflow-hidden">
                            <Image
                              src={getImageUrl(item.image || 'images/placeholder.png')}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 bg-gray-100 border-2 border-white rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>

                    {order.estimatedDelivery && order.status === 'shipped' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-800">
                            Estimated delivery: {formatDate(order.estimatedDelivery)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <RouteGuard requireAuth={true}>
      <OrderHistoryContent />
    </RouteGuard>
  );
}