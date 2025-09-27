#!/bin/bash

echo "🚀 Starting Project Nexus Authentication Server..."
echo "📍 Server will run on http://localhost:4000"
echo "✨ Features:"
echo "  - User registration & login"
echo "  - JWT authentication"
echo "  - Role-based access (buyer/seller)"
echo "  - Product management"
echo "  - Shopping cart functionality"
echo ""
echo "📋 Available endpoints:"
echo "  Authentication:"
echo "    POST /api/auth/register - Register new user"
echo "    POST /api/auth/login - Login user"
echo "    GET  /api/auth/me - Get current user"
echo ""
echo "  Products:"
echo "    GET  /api/products - Get all products"
echo "    POST /api/products - Create product (sellers only)"
echo ""
echo "  Shopping:"
echo "    GET  /api/cart - Get user cart"
echo "    POST /api/cart/add - Add item to cart"
echo ""
echo "  Users & Data:"
echo "    GET  /api/users - Get all users (without passwords)"
echo "    GET  /api/carts - Get all carts"
echo "    GET  /api/orders - Get all orders"
echo ""
echo "📸 Static images served at: /images/*"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

cd "$(dirname "$0")/api"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
node server.js