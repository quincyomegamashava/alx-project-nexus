const fetch = require('node-fetch');

async function testCheckout() {
  try {
    console.log('🧪 Testing checkout functionality...\n');
    
    // First, let's login to get a token
    console.log('1. Logging in as buyer...');
    const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jane.buyer@example.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }
    
    const { token } = await loginResponse.json();
    console.log('✅ Login successful\n');
    
    // Test 1: Cash on delivery order
    console.log('2. Testing Cash on Delivery order...');
    const codOrderData = {
      items: [
        { productId: 1, quantity: 1, price: 120 }
      ],
      totalAmount: 120,
      shippingAddress: {
        fullName: 'Jane Buyer',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        phone: '+1234567891'
      },
      paymentMethod: 'cash_on_delivery'
    };
    
    const codResponse = await fetch('http://localhost:4000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(codOrderData)
    });
    
    if (!codResponse.ok) {
      const errorData = await codResponse.json();
      throw new Error(`COD Order failed: ${errorData.error}`);
    }
    
    const codOrder = await codResponse.json();
    console.log('✅ Cash on Delivery order placed successfully');
    console.log(`   Order ID: ${codOrder.order.id}`);
    console.log(`   Payment Method: ${codOrder.order.paymentMethod}`);
    console.log(`   Shipping Address: ${codOrder.order.shippingAddress.fullName}, ${codOrder.order.shippingAddress.city}\n`);
    
    // Test 2: Credit card order
    console.log('3. Testing Credit Card order...');
    const creditOrderData = {
      items: [
        { productId: 2, quantity: 1, price: 80 }
      ],
      totalAmount: 90.99, // Including shipping
      shippingAddress: {
        fullName: 'Jane Buyer',
        address: '456 Another Street',
        city: 'Another City',
        state: 'Another State',
        zipCode: '54321',
        phone: '+1987654321'
      },
      paymentMethod: 'credit_card'
    };
    
    const creditResponse = await fetch('http://localhost:4000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(creditOrderData)
    });
    
    if (!creditResponse.ok) {
      const errorData = await creditResponse.json();
      throw new Error(`Credit Card Order failed: ${errorData.error}`);
    }
    
    const creditOrder = await creditResponse.json();
    console.log('✅ Credit Card order placed successfully');
    console.log(`   Order ID: ${creditOrder.order.id}`);
    console.log(`   Payment Method: ${creditOrder.order.paymentMethod}`);
    console.log(`   Total Amount: $${creditOrder.order.totalAmount}\n`);
    
    // Test 3: Get orders to verify they were created
    console.log('4. Fetching user orders...');
    const ordersResponse = await fetch('http://localhost:4000/api/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!ordersResponse.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    const orders = await ordersResponse.json();
    console.log('✅ Orders fetched successfully');
    console.log(`   Total orders: ${orders.length}`);
    console.log(`   Latest order: ID ${orders[orders.length - 1].id} - ${orders[orders.length - 1].paymentMethod}\n`);
    
    console.log('🎉 All checkout tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testCheckout();