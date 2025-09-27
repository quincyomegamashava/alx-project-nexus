#!/bin/bash

# Start All Services Script for Project Nexus
echo "🚀 Starting Project Nexus services..."

# Function to start a service in background and track it
start_service() {
    local name=$1
    local dir=$2
    local command=$3
    
    echo "🔄 Starting $name..."
    cd "$dir"
    eval "$command" &
    local pid=$!
    echo "✅ $name started (PID: $pid)"
    return $pid
}

# Kill any existing processes on common ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true

# Start Backend API
start_service "Backend API" "$(pwd)/api" "npm start"
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3

# Start Frontend (Next.js)
start_service "Frontend Web App" "$(pwd)/frontend" "npm run dev"
FRONTEND_PID=$!

# Start Mobile (Expo)
echo "🔄 Starting Mobile App (Expo)..."
cd "$(pwd)/mobile"
npx expo start --offline &
MOBILE_PID=$!
echo "✅ Mobile App started (PID: $MOBILE_PID)"

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📍 Service URLs:"
echo "   Backend API:    http://localhost:4000"
echo "   Frontend Web:   http://localhost:3000"
echo "   Mobile Expo:    http://localhost:8081"
echo ""
echo "📱 Mobile Development:"
echo "   Scan QR code with Expo Go app"
echo "   Or press 'w' in the Expo terminal for web preview"
echo ""
echo "⚠️  Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    kill $MOBILE_PID 2>/dev/null || true
    
    # Force kill any remaining processes
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    
    echo "✅ All services stopped"
    exit 0
}

# Setup signal handlers
trap cleanup INT TERM

# Wait for all processes
wait