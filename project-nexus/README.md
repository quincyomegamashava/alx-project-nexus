# Project Nexus - E-commerce Platform

A full-stack e-commerce platform with web and mobile applications, featuring complete checkout flows with multiple payment options.

## 🚀 Quick Start

### Option 1: Start All Services
```bash
./start-all.sh
```

### Option 2: Start Services Individually

#### Backend API
```bash
cd api
npm start
# Runs on http://localhost:4000
```

#### Frontend Web App
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

#### Mobile App
```bash
cd mobile
npm start
# Runs on http://localhost:8081 (offline mode)
```

## 🛠 Troubleshooting

### Mobile App Fetch Errors
If you see `TypeError: fetch failed` when starting the mobile app:

**Solution**: The mobile app now starts in offline mode by default to avoid connectivity issues.
- Use `npm start` for offline mode (recommended for development)
- Use `npm run start-online` if you need online mode

### Frontend Images Not Loading
If product images show as placeholders:

**Fixed**: Product images have been copied to the frontend public directory and the image utility has been updated to handle local images in development mode.

**Manual Fix** (if needed):
```bash
cp api/public/images/*.jpeg frontend/public/images/
```

### Backend API Connection Issues
Make sure the backend is running before starting the frontend/mobile apps:

```bash
cd api
npm start
```

The API should show:
```
🚀 Server running on http://localhost:4000
📊 Database initialized
```

## 🎯 Key Features Implemented

### ✅ Complete Checkout Flow
- **Multi-step checkout**: Shipping → Payment → Review
- **Payment options**: Credit Card, Cash on Delivery
- **Address collection**: Full shipping address with validation
- **Order summary**: Dynamic pricing with shipping costs
- **Cross-platform**: Works on web and mobile

### ✅ Enhanced Cart System
- **Redux state management**: Persistent cart with checkout state
- **Real-time updates**: Quantity changes, item removal
- **Stock validation**: Prevents over-ordering
- **Cross-platform sync**: Consistent experience

### ✅ User Management
- **Authentication**: Login/Register with JWT tokens
- **Role-based access**: Buyers and Sellers with different permissions
- **Profile editing**: Update personal information
- **Order history**: View past orders

### ✅ Product Management
- **Product catalog**: Browse products by category
- **Product details**: Images, descriptions, ratings
- **Stock tracking**: Real-time inventory updates
- **Search and filter**: Easy product discovery

## 📱 Platform Support

- **Web**: Next.js with responsive design
- **Mobile**: React Native with Expo
- **Backend**: Node.js with Express and LowDB

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate limiting**: Prevent abuse on auth endpoints
- **Input validation**: Server-side validation with express-validator
- **Role-based authorization**: Protect sensitive operations

## 🎨 UI/UX Features

- **Responsive design**: Works on all screen sizes
- **Loading states**: User feedback during operations
- **Error handling**: Graceful error messages
- **Modern styling**: Clean, professional interface

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profile
- `PUT /api/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (sellers only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Place new order (enhanced with checkout data)

## 🚦 Development Notes

### Environment Variables
- **Frontend**: `NEXT_PUBLIC_API_URL` (defaults to http://localhost:4000)
- **Mobile**: `EXPO_PUBLIC_API_URL` (defaults to http://192.168.103.80:4000)

### Image Handling
- Images are served from both backend and frontend for redundancy
- Fallback system ensures images work even when backend is offline
- Mobile app uses placeholder images for better UX

### Database
- Uses LowDB for simple file-based database
- Data persists in `api/database.json`
- Includes sample data for testing

## 🎉 What's New in Latest Update

✅ **Complete Checkout Implementation**
- Multi-step checkout flow with shipping, payment, and review
- Cash on Delivery and Credit Card payment options
- Enhanced Redux state management
- Cross-platform checkout experience

✅ **Image Loading Fixes**
- Product images now load correctly on both platforms
- Fallback system for better reliability
- Local image caching for development

✅ **Mobile App Stability**
- Fixed fetch errors on startup
- Offline mode by default for development
- Better error handling and user feedback

✅ **Enhanced User Experience**
- Professional checkout interface
- Dynamic pricing with shipping costs
- Form validation and error messages
- Loading states and success confirmations