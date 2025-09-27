# 🛒 Project Nexus - E-Commerce Platform

> A full-stack, multi-platform e-commerce solution with advanced checkout flows, built with modern web technologies.

![Project Nexus](https://img.shields.io/badge/Project-Nexus-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=for-the-badge&logo=nextdotjs)
![React Native](https://img.shields.io/badge/React_Native-Expo-blue?style=for-the-badge&logo=expo)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)

## 🌟 **Project Overview**

Project Nexus is a **production-ready e-commerce platform** that demonstrates modern full-stack development practices. It features a complete shopping experience across web and mobile platforms with advanced checkout flows, user authentication, and real-time inventory management.

**🎯 This project goes far beyond a simple product catalog** - it's a complete e-commerce ecosystem with professional-grade features and deployment-ready architecture.

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Mobile App    │
│   Next.js       │◄──►│   Node.js       │◄──►│   React Native  │
│   TypeScript    │    │   Express       │    │   Expo          │
│   Redux Toolkit │    │   LowDB         │    │   Redux Toolkit │
│   Tailwind CSS  │    │   JWT Auth      │    │   TypeScript    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Start**

### **One-Command Setup**
```bash
# Clone and start all services
git clone https://github.com/YOUR_USERNAME/project-nexus.git
cd project-nexus
chmod +x start-all.sh
./start-all.sh
```

### **Manual Setup**
```bash
# Backend API
cd api && npm install && npm start

# Frontend Web App  
cd frontend && npm install && npm run dev

# Mobile App
cd mobile && npm install && npm start
```

**🎉 That's it! Your e-commerce platform is running:**
- 🌐 Frontend: http://localhost:3000
- 🗄️ API: http://localhost:4000
- 📱 Mobile: http://localhost:8081

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