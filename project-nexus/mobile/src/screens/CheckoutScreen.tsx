import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RouteGuard from '../components/RouteGuard';
import { getMobileImageUrl } from '../utils/imageUrl';
import { clearCart, setShippingAddress, setPaymentMethod, setCheckingOut } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';
import type { ShippingAddress } from '../store/slices/cartSlice';

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

function CheckoutContent() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalAmount, shippingAddress, paymentMethod, isCheckingOut } = useSelector((state: RootState) => state.cart);
  const { user, token } = useSelector((state: RootState) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const [shippingInfo, setShippingInfoLocal] = useState<ShippingAddress>({
    fullName: user?.name || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    phone: user?.phone || ''
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: user?.name || ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod);

  const shippingCost = selectedPaymentMethod === 'cash_on_delivery' ? 0 : 10.99;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + shippingCost + tax;

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart' as any);
    }
  }, [items, router, orderComplete]);

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    const updatedShipping = {
      ...shippingInfo,
      [field]: value
    };
    setShippingInfoLocal(updatedShipping);
    dispatch(setShippingAddress(updatedShipping));
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentInfo(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validateShipping = () => {
    const required = ['fullName', 'phone', 'address', 'city', 'zipCode'];
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingAddress].trim()) {
        Alert.alert('Validation Error', `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    
    return true;
  };

  const validatePayment = () => {
    if (selectedPaymentMethod === 'cash_on_delivery') {
      return true; // No validation needed for cash on delivery
    }
    
    if (!paymentInfo.cardNumber.replace(/\s/g, '') || paymentInfo.cardNumber.replace(/\s/g, '').length < 13) {
      Alert.alert('Validation Error', 'Please enter a valid card number');
      return false;
    }
    if (!paymentInfo.expiryDate || paymentInfo.expiryDate.length !== 5) {
      Alert.alert('Validation Error', 'Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
      Alert.alert('Validation Error', 'Please enter a valid CVV');
      return false;
    }
    if (!paymentInfo.cardholderName.trim()) {
      Alert.alert('Validation Error', 'Cardholder name is required');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateShipping()) return;
    if (currentStep === 2 && !validatePayment()) return;
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    
    dispatch(setCheckingOut(true));

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: finalTotal,
        shippingAddress: shippingInfo,
        paymentMethod: selectedPaymentMethod
      };

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://alx-project-nexus-production-4427.up.railway.app';
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const result = await response.json();
      setOrderId(result.order.id.toString());
      setOrderComplete(true);
      dispatch(clearCart());

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to place order. Please try again.');
    } finally {
      dispatch(setCheckingOut(false));
    }
  };

  if (orderComplete) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#10b981" />
          </View>
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successMessage}>
            Thank you for your purchase. Your order has been received and is being processed.
          </Text>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order Number</Text>
            <Text style={styles.orderIdText}>{orderId}</Text>
          </View>
          <View style={styles.successButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/orders' as any)}
            >
              <Text style={styles.primaryButtonText}>View Order Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/products' as any)}
            >
              <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/cart' as any)}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.progressStep}>
            <View style={[
              styles.progressCircle,
              currentStep >= step && styles.progressCircleActive
            ]}>
              <Text style={[
                styles.progressNumber,
                currentStep >= step && styles.progressNumberActive
              ]}>
                {step}
              </Text>
            </View>
            <Text style={[
              styles.progressLabel,
              currentStep >= step && styles.progressLabelActive
            ]}>
              {step === 1 && 'Shipping'}
              {step === 2 && 'Payment'}
              {step === 3 && 'Review'}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Shipping Information */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Ionicons name="location-outline" size={24} color="#4f46e5" />
              <Text style={styles.stepTitle}>Shipping Information</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={shippingInfo.fullName}
                onChangeText={(text) => handleShippingChange('fullName', text)}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>State *</Text>
              <TextInput
                style={styles.textInput}
                value={shippingInfo.state}
                onChangeText={(text) => handleShippingChange('state', text)}
                placeholder="Enter your state"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.textInput}
                value={shippingInfo.phone}
                onChangeText={(text) => handleShippingChange('phone', text)}
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Street Address *</Text>
              <TextInput
                style={styles.textInput}
                value={shippingInfo.address}
                onChangeText={(text) => handleShippingChange('address', text)}
                placeholder="Enter your street address"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.textInput}
                  value={shippingInfo.city}
                  onChangeText={(text) => handleShippingChange('city', text)}
                  placeholder="City"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>ZIP Code *</Text>
                <TextInput
                  style={styles.textInput}
                  value={shippingInfo.zipCode}
                  onChangeText={(text) => handleShippingChange('zipCode', text)}
                  placeholder="ZIP"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

          </View>
        )}

        {/* Step 2: Payment Information */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Ionicons name="card-outline" size={24} color="#4f46e5" />
              <Text style={styles.stepTitle}>Payment Information</Text>
            </View>

            {/* Payment Method Selection */}
            <View style={styles.paymentMethodContainer}>
              <Text style={styles.inputLabel}>Select Payment Method *</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPaymentMethod === 'credit_card' && styles.paymentOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedPaymentMethod('credit_card');
                    dispatch(setPaymentMethod('credit_card'));
                  }}
                >
                  <View style={styles.paymentOptionContent}>
                    <Ionicons name="card" size={20} color={selectedPaymentMethod === 'credit_card' ? '#4f46e5' : '#6b7280'} />
                    <View style={styles.paymentOptionText}>
                      <Text style={[
                        styles.paymentOptionTitle,
                        selectedPaymentMethod === 'credit_card' && styles.paymentOptionTitleSelected
                      ]}>Credit/Debit Card</Text>
                      <Text style={styles.paymentOptionSubtitle}>Pay securely with your card</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedPaymentMethod === 'credit_card' && styles.radioButtonSelected
                  ]} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPaymentMethod === 'cash_on_delivery' && styles.paymentOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedPaymentMethod('cash_on_delivery');
                    dispatch(setPaymentMethod('cash_on_delivery'));
                  }}
                >
                  <View style={styles.paymentOptionContent}>
                    <Ionicons name="cash" size={20} color={selectedPaymentMethod === 'cash_on_delivery' ? '#4f46e5' : '#6b7280'} />
                    <View style={styles.paymentOptionText}>
                      <Text style={[
                        styles.paymentOptionTitle,
                        selectedPaymentMethod === 'cash_on_delivery' && styles.paymentOptionTitleSelected
                      ]}>Cash on Delivery</Text>
                      <Text style={styles.paymentOptionSubtitle}>Pay when you receive</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedPaymentMethod === 'cash_on_delivery' && styles.radioButtonSelected
                  ]} />
                </TouchableOpacity>
              </View>
            </View>

            {selectedPaymentMethod === 'credit_card' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Card Number *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={paymentInfo.cardNumber}
                    onChangeText={(text) => handlePaymentChange('cardNumber', text)}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Cardholder Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={paymentInfo.cardholderName}
                    onChangeText={(text) => handlePaymentChange('cardholderName', text)}
                    placeholder="Name on card"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Expiry Date *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={paymentInfo.expiryDate}
                      onChangeText={(text) => handlePaymentChange('expiryDate', text)}
                      placeholder="MM/YY"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>CVV *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={paymentInfo.cvv}
                      onChangeText={(text) => handlePaymentChange('cvv', text)}
                      placeholder="123"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      secureTextEntry
                    />
                  </View>
                </View>
              </>
            )}

            {selectedPaymentMethod === 'cash_on_delivery' && (
              <View style={styles.cashOnDeliveryNotice}>
                <View style={styles.cashOnDeliveryContent}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  <View style={styles.cashOnDeliveryText}>
                    <Text style={styles.cashOnDeliveryTitle}>Cash on Delivery Selected</Text>
                    <Text style={styles.cashOnDeliverySubtitle}>
                      You will pay when your order is delivered. No shipping charges apply.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Step 3: Order Review */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Ionicons name="receipt-outline" size={24} color="#4f46e5" />
              <Text style={styles.stepTitle}>Review Your Order</Text>
            </View>

            {/* Order Items */}
            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Items</Text>
              {items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <Image
                    source={{ uri: getMobileImageUrl(item.image) }}
                    style={styles.orderItemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemTitle}>{item.title}</Text>
                    <Text style={styles.orderItemDetails}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.orderItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Shipping Address */}
            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Shipping Address</Text>
              <View style={styles.addressCard}>
                <Text style={styles.addressName}>{shippingInfo.fullName}</Text>
                <Text style={styles.addressText}>{shippingInfo.address}</Text>
                <Text style={styles.addressText}>
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                </Text>
                <Text style={styles.addressText}>Phone: {shippingInfo.phone}</Text>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.reviewSection}>
              <Text style={styles.reviewSectionTitle}>Payment Method</Text>
              <View style={styles.addressCard}>
                {selectedPaymentMethod === 'cash_on_delivery' ? (
                  <Text style={styles.addressText}>Cash on Delivery</Text>
                ) : (
                  <>
                    <Text style={styles.addressText}>
                      **** **** **** {paymentInfo.cardNumber.slice(-4)}
                    </Text>
                    <Text style={styles.addressText}>{paymentInfo.cardholderName}</Text>
                  </>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shippingCost.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevious}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 3 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.primaryNavButton]}
            onPress={handleNext}
          >
            <Text style={styles.primaryNavButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.placeOrderButton]}
            onPress={handlePlaceOrder}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default function CheckoutScreen() {
  return (
    <RouteGuard requireAuth={true} requiredRole="buyer">
      <CheckoutContent />
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
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressCircleActive: {
    backgroundColor: '#4f46e5',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  progressNumberActive: {
    color: '#ffffff',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressLabelActive: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
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
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  orderItemDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  addressCard: {
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
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  primaryNavButton: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  placeOrderButton: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  primaryNavButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 20,
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  orderIdContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
    width: '100%',
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  successButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentOptionSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#f8fafc',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentOptionText: {
    marginLeft: 12,
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  paymentOptionTitleSelected: {
    color: '#4f46e5',
  },
  paymentOptionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  radioButtonSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#4f46e5',
  },
  cashOnDeliveryNotice: {
    marginTop: 16,
  },
  cashOnDeliveryContent: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cashOnDeliveryText: {
    marginLeft: 12,
    flex: 1,
  },
  cashOnDeliveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  cashOnDeliverySubtitle: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },
});
