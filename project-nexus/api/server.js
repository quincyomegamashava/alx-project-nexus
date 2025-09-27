import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Custom middleware for image CORS headers
app.use('/images', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  next();
});

app.use(express.static('public'));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
});

// Initialize database
const file = path.join(__dirname, 'database.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

// Initialize database with default data
async function initDatabase() {
  await db.read();
  
  // Initialize with empty object if no data exists
  db.data ||= {};
  
  if (!db.data.users) {
    db.data = {
      users: [
        {
          id: 1,
          email: 'john.seller@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'John Seller',
          role: 'seller',
          avatar: '/images/avatar1.png',
          createdAt: new Date().toISOString(),
          phone: '+1234567890',
          address: '123 Seller St, Commerce City'
        },
        {
          id: 2,
          email: 'jane.buyer@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Jane Buyer',
          role: 'buyer',
          avatar: '/images/avatar2.png',
          createdAt: new Date().toISOString(),
          phone: '+1234567891',
          address: '456 Buyer Ave, Shopping Town'
        }
      ],
      products: [
        { id: 1, title: 'Leather Jacket', price: 120, category: 'Clothing', image: '/images/jacket.jpeg', rating: 4.5, description: 'Premium leather jacket with modern fit', sellerId: 1, stock: 10 },
        { id: 2, title: 'Running Shoes', price: 80, category: 'Shoes', image: '/images/shoes.jpeg', rating: 4.2, description: 'Comfortable running shoes for daily workouts', sellerId: 2, stock: 15 },
        { id: 3, title: 'Wireless Headphones', price: 150, category: 'Electronics', image: '/images/headphones.jpeg', rating: 4.8, description: 'Noise-cancelling wireless headphones', sellerId: 1, stock: 8 },
        { id: 4, title: 'Denim Jeans', price: 60, category: 'Clothing', image: '/images/jeans.jpeg', rating: 4.0, description: 'Classic fit denim jeans', sellerId: 1, stock: 20 },
        { id: 5, title: 'Smartphone', price: 699, category: 'Electronics', image: '/images/phone.jpeg', rating: 4.7, description: 'Latest smartphone with advanced features', sellerId: 2, stock: 5 },
        { id: 6, title: 'Sneakers', price: 95, category: 'Shoes', image: '/images/sneakers.jpeg', rating: 4.3, description: 'Stylish casual sneakers for everyday wear', sellerId: 1, stock: 12 }
      ],
      carts: [],
      orders: [],
      nextUserId: 3,
      nextProductId: 7,
      nextCartId: 1,
      nextOrderId: 1
    };
    await db.write();
  }
}

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await db.read();
    const user = db.data.users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = { ...user };
    delete req.user.password; // Remove password from user object
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Validation middleware
const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller')
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// AUTH ROUTES
app.post('/api/auth/register', authLimiter, validateRegister, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role, phone, address } = req.body;

    await db.read();
    
    // Check if user already exists
    const existingUser = db.data.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: db.data.nextUserId,
      email,
      password: hashedPassword,
      name,
      role,
      phone: phone || '',
      address: address || '',
      avatar: `/images/avatar${db.data.nextUserId}.png`,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newUser);
    db.data.nextUserId++;
    await db.write();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });

    // Return user data without password
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    await db.read();
    
    // Find user
    const user = db.data.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    // Return user data without password
    const { password: _, ...userResponse } = user;
    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  try {
    await db.read();
    let products = [...db.data.products];

    // Apply filters
    const { category, _sort, _order, _page, _limit } = req.query;

    if (category && category !== 'All') {
      products = products.filter(p => p.category === category);
    }

    if (_sort) {
      products.sort((a, b) => {
        const order = _order === 'desc' ? -1 : 1;
        if (a[_sort] < b[_sort]) return -1 * order;
        if (a[_sort] > b[_sort]) return 1 * order;
        return 0;
      });
    }

    // Pagination
    const page = parseInt(_page) || 1;
    const limit = parseInt(_limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    products = products.slice(startIndex, endIndex);

    res.json(products);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can create products' });
    }

    const { title, price, category, description, image, stock } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, price, and category are required' });
    }

    await db.read();

    const newProduct = {
      id: db.data.nextProductId,
      title,
      price: parseFloat(price),
      category,
      description: description || '',
      image: image || '/images/default-product.png',
      stock: parseInt(stock) || 0,
      sellerId: req.user.id,
      rating: 0,
      createdAt: new Date().toISOString()
    };

    db.data.products.push(newProduct);
    db.data.nextProductId++;
    await db.write();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CART ROUTES
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    await db.read();
    const cart = db.data.carts.find(c => c.userId === req.user.id) || { items: [] };
    res.json(cart);
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ error: 'Only buyers can add items to cart' });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    await db.read();

    // Check if product exists
    const product = db.data.products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find or create cart
    let cart = db.data.carts.find(c => c.userId === req.user.id);
    if (!cart) {
      cart = {
        id: db.data.nextCartId,
        userId: req.user.id,
        items: [],
        updatedAt: new Date().toISOString()
      };
      db.data.carts.push(cart);
      db.data.nextCartId++;
    }

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    cart.updatedAt = new Date().toISOString();
    await db.write();

    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// USER ROUTES
app.get('/api/users', async (req, res) => {
  try {
    await db.read();
    const users = db.data.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Profile update route
app.put('/api/profile', authenticateToken, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim(),
  body('address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address } = req.body;
    const userId = req.user.id;

    await db.read();

    // Check if email is being changed and if it's already taken by another user
    if (email) {
      const existingUser = db.data.users.find(user => user.email === email && user.id !== userId);
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already taken by another user' });
      }
    }

    // Find and update user
    const userIndex = db.data.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    const updatedUser = { ...db.data.users[userIndex] };
    if (name !== undefined) updatedUser.name = name;
    if (email !== undefined) updatedUser.email = email;
    if (phone !== undefined) updatedUser.phone = phone;
    if (address !== undefined) updatedUser.address = address;
    updatedUser.updatedAt = new Date().toISOString();

    db.data.users[userIndex] = updatedUser;
    await db.write();

    // Return updated user without password
    const { password: _, ...userResponse } = updatedUser;
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/carts', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.carts);
  } catch (error) {
    console.error('Carts fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ORDERS ROUTES
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    await db.read();
    let orders = db.data.orders.filter(order => order.userId === req.user.id);
    
    // Populate order items with product details
    orders = orders.map(order => ({
      ...order,
      items: order.items.map(item => {
        const product = db.data.products.find(p => p.id === item.productId);
        return {
          ...item,
          product
        };
      })
    }));
    
    res.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', authenticateToken, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('shippingAddress').optional().isObject().withMessage('Shipping address must be an object'),
  body('paymentMethod').optional().isString().withMessage('Payment method must be a string')
], async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ error: 'Only buyers can place orders' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    await db.read();

    // Validate items and check stock
    for (const item of items) {
      const product = db.data.products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.title}` });
      }
    }

    // Create order
    const newOrder = {
      id: db.data.nextOrderId,
      userId: req.user.id,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        title: db.data.products.find(p => p.id === item.productId)?.title
      })),
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      shippingAddress: shippingAddress || {
        fullName: req.user.name,
        address: req.user.address || '',
        city: '',
        state: '',
        zipCode: '',
        phone: req.user.phone || ''
      },
      paymentMethod: paymentMethod || 'cash_on_delivery',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update product stock
    items.forEach(item => {
      const productIndex = db.data.products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        db.data.products[productIndex].stock -= item.quantity;
      }
    });

    db.data.orders.push(newOrder);
    db.data.nextOrderId++;
    await db.write();

    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database initialized at ${file}`);
    console.log('📋 Available routes:');
    console.log('  POST /api/auth/register - Register new user');
    console.log('  POST /api/auth/login - Login user');
    console.log('  GET /api/auth/me - Get current user');
    console.log('  PUT /api/profile - Update user profile');
    console.log('  GET /api/products - Get products');
    console.log('  POST /api/products - Create product (sellers only)');
    console.log('  GET /api/cart - Get user cart');
    console.log('  POST /api/cart/add - Add item to cart');
    console.log('  GET /api/orders - Get user orders');
    console.log('  POST /api/orders - Place new order (buyers only)');
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});