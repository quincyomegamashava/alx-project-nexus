'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  CheckCircle,
  ShoppingBag,
  Truck
} from 'lucide-react';
import Image from 'next/image';
import RouteGuard from '../../components/RouteGuard';
import { getImageUrl } from '../../utils/imageUrl';
import { clearCart, setShippingAddress, setPaymentMethod, setCheckingOut } from '../../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../../store';
import type { ShippingAddress } from '../../store/slices/cartSlice';

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
  const [error, setError] = useState<string | null>(null);

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
  const tax = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + shippingCost + tax;

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [items, router, orderComplete]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedShipping = {
      ...shippingInfo,
      [name]: value
    };
    setShippingInfoLocal(updatedShipping);
    dispatch(setShippingAddress(updatedShipping));
    if (error) setError(null);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    if (error) setError(null);
  };

  const validateShipping = () => {
    const required = ['fullName', 'phone', 'address', 'city', 'zipCode'];
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingAddress].trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
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
      setError('Please enter a valid card number');
      return false;
    }
    if (!paymentInfo.expiryDate || paymentInfo.expiryDate.length !== 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    if (!paymentInfo.cardholderName.trim()) {
      setError('Cardholder name is required');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateShipping()) return;
    if (currentStep === 2 && !validatePayment()) return;
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    
    dispatch(setCheckingOut(true));
    setError(null);

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

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.103.80:4000';
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

    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      dispatch(setCheckingOut(false));
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-lg font-mono font-bold text-gray-900">{orderId}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/orders')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                View Order Status
              </button>
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
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
            onClick={() => router.push('/cart')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step}
                </div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= step ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {step === 1 && 'Shipping'}
                  {step === 2 && 'Payment'}
                  {step === 3 && 'Review'}
                </span>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 ${currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Truck className="h-6 w-6 mr-2" />
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your state"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your street address"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your city"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="h-6 w-6 mr-2" />
                    Payment Information
                  </h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-4 block">
                      Select Payment Method *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors">
                        <input
                          type="radio"
                          value="credit_card"
                          checked={selectedPaymentMethod === 'credit_card'}
                          onChange={(e) => {
                            setSelectedPaymentMethod(e.target.value);
                            dispatch(setPaymentMethod(e.target.value));
                          }}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Credit/Debit Card</div>
                          <div className="text-sm text-gray-600">Pay securely with your card</div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors">
                        <input
                          type="radio"
                          value="cash_on_delivery"
                          checked={selectedPaymentMethod === 'cash_on_delivery'}
                          onChange={(e) => {
                            setSelectedPaymentMethod(e.target.value);
                            dispatch(setPaymentMethod(e.target.value));
                          }}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when you receive</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {selectedPaymentMethod === 'credit_card' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={paymentInfo.cardholderName}
                        onChange={handlePaymentChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Name on card"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                  )}

                  {selectedPaymentMethod === 'cash_on_delivery' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                          <div className="font-medium text-green-800">Cash on Delivery Selected</div>
                          <div className="text-sm text-green-600">You will pay when your order is delivered. No shipping charges apply.</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <ShoppingBag className="h-6 w-6 mr-2" />
                    Review Your Order
                  </h2>
                  
                  {/* Shipping Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping To:</h3>
                    <p className="text-gray-600">{shippingInfo.fullName}</p>
                    <p className="text-gray-600">{shippingInfo.address}</p>
                    <p className="text-gray-600">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p className="text-gray-600">Phone: {shippingInfo.phone}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Payment Method:</h3>
                    {selectedPaymentMethod === 'cash_on_delivery' ? (
                      <p className="text-gray-600">Cash on Delivery</p>
                    ) : (
                      <>
                        <p className="text-gray-600">**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                        <p className="text-gray-600">{paymentInfo.cardholderName}</p>
                      </>
                    )}
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-16 h-16 relative">
                          <Image
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            fill
                            className="object-cover rounded-lg"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handlePreviousStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="ml-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isCheckingOut}
                    className="ml-auto px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {isCheckingOut ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">{item.title} × {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
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

export default function CheckoutPage() {
  return (
    <RouteGuard requireAuth={true} requiredRole="buyer">
      <CheckoutContent />
    </RouteGuard>
  );
}