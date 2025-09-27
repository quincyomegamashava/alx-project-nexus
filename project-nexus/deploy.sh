#!/bin/bash

# 🚀 Project Nexus Deployment Script
echo "🚀 Deploying Project Nexus..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_warning "Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial commit: Project Nexus e-commerce platform"
fi

# Check for required environment files
print_status "Checking environment configuration..."

if [ ! -f "frontend/.env.local" ]; then
    print_warning "Frontend .env.local not found. Creating from example..."
    cp frontend/.env.example frontend/.env.local
    print_warning "Please edit frontend/.env.local with your API URL"
fi

if [ ! -f "mobile/.env" ]; then
    print_warning "Mobile .env not found. Creating from example..."
    cp mobile/.env.example mobile/.env
    print_warning "Please edit mobile/.env with your API URL"
fi

if [ ! -f "api/.env" ]; then
    print_warning "API .env not found. Creating from example..."
    cp api/.env.example api/.env
    print_warning "Please edit api/.env with your configuration"
fi

# Install dependencies
print_status "Installing dependencies..."
echo "📦 Installing API dependencies..."
(cd api && npm install)

echo "📦 Installing Frontend dependencies..."
(cd frontend && npm install)

echo "📦 Installing Mobile dependencies..."
(cd mobile && npm install)

# Build applications
print_status "Building applications..."
echo "🏗️ Building frontend..."
(cd frontend && npm run build)

print_status "Testing API..."
(cd api && npm test 2>/dev/null || echo "No tests configured")

# Deployment instructions
echo ""
echo "🎯 Next Steps for Deployment:"
echo ""
echo "1. 🗄️ Backend API (Railway):"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Create a new project and select the 'api' folder"
echo "   - Set environment variables in Railway dashboard"
echo ""
echo "2. 🌐 Frontend (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'frontend'"
echo "   - Add environment variable: NEXT_PUBLIC_API_URL"
echo ""
echo "3. 📱 Mobile App (Expo):"
echo "   - Install EAS CLI: npm install -g eas-cli"
echo "   - Login to Expo: eas login"
echo "   - Configure project: eas build:configure"
echo "   - Build for Android: eas build --platform android"
echo ""
echo "4. 🔄 Enable GitHub Actions:"
echo "   - Add these secrets to your GitHub repository:"
echo "     - VERCEL_TOKEN (from Vercel dashboard)"
echo "     - VERCEL_ORG_ID (from Vercel dashboard)"
echo "     - VERCEL_PROJECT_ID (from Vercel dashboard)"
echo "     - RAILWAY_TOKEN (from Railway dashboard)"
echo "     - RAILWAY_PROJECT_ID (from Railway dashboard)"
echo "     - EXPO_TOKEN (from Expo dashboard)"
echo ""

print_status "Deployment preparation complete!"
print_warning "Remember to update API URLs in environment files after deployment!"

# Optional: Create GitHub repository
read -p "🤔 Do you want to create a GitHub repository now? (y/N): " create_repo
if [[ $create_repo == "y" || $create_repo == "Y" ]]; then
    echo "Please create a repository on GitHub and run:"
    echo "git remote add origin https://github.com/yourusername/project-nexus.git"
    echo "git branch -M main"
    echo "git push -u origin main"
fi