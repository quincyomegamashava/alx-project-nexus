# 🚀 Project Nexus - CI/CD Deployment Guide

This guide will walk you through deploying your Project Nexus e-commerce platform with full CI/CD automation.

## 🏗️ **Deployment Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Mobile App    │
│   (Vercel)      │◄──►│   (Railway)     │◄──►│   (Expo EAS)    │
│   Next.js       │    │   Node.js       │    │   React Native  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                  ┌─────────────────┐
                  │  GitHub Actions │
                  │   (CI/CD)       │
                  └─────────────────┘
```

## 📋 **Prerequisites**

### Required Accounts:
- [ ] **GitHub** - Version control and CI/CD
- [ ] **Vercel** - Frontend hosting
- [ ] **Railway** - Backend API hosting  
- [ ] **Expo** - Mobile app builds

### Required Tools:
```bash
# Install required CLI tools
npm install -g vercel eas-cli @railway/cli
```

## 🚀 **Quick Deployment (5 minutes)**

### Step 1: Prepare Repository
```bash
# Run the deployment preparation script
./deploy.sh

# Initialize git if not already done
git init
git add .
git commit -m "feat: initial deployment setup"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create repository named `project-nexus`
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/project-nexus.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend API (Railway)
1. Go to [Railway](https://railway.app)
2. Click "Start a New Project" 
3. Select "Deploy from GitHub repo"
4. Choose your `project-nexus` repository
5. Set **Root Directory**: `api`
6. Add environment variables:
   - `JWT_SECRET`: `your-super-secret-jwt-key-make-it-long-and-secure`
   - `NODE_ENV`: `production`
   - `PORT`: `4000` (Railway will override this)

**Your API will be live at**: `https://your-project-name.railway.app`

### Step 4: Deploy Frontend (Vercel)
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory**: `frontend`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: `https://your-api-domain.railway.app`
6. Deploy!

**Your frontend will be live at**: `https://your-project-name.vercel.app`

### Step 5: Build Mobile App (Expo)
```bash
cd mobile

# Login to Expo
eas login

# Configure the project
eas build:configure

# Build for Android (preview)
eas build --platform android --profile preview
```

Your mobile app build will be available in the Expo dashboard.

## 🔄 **CI/CD Setup (Automated Deployments)**

### Step 1: Configure GitHub Secrets
Go to your repository → Settings → Secrets and Variables → Actions

Add these secrets:

#### Vercel Secrets:
```bash
# Get from Vercel dashboard → Settings → Tokens
VERCEL_TOKEN=your_vercel_token

# Get from Vercel project settings
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

#### Railway Secrets:
```bash
# Get from Railway dashboard → Account → Tokens
RAILWAY_TOKEN=your_railway_token

# Get from Railway project settings
RAILWAY_PROJECT_ID=your_project_id
```

#### Expo Secrets:
```bash
# Get from Expo dashboard → Access Tokens
EXPO_TOKEN=your_expo_token
```

### Step 2: Test CI/CD Pipeline
```bash
# Make a small change
echo "# Updated" >> README.md
git add .
git commit -m "feat: test CI/CD pipeline"
git push origin main
```

Go to **GitHub Actions** tab to watch the deployment!

## 🌍 **Environment Management**

### Production Environment
- **Branch**: `main`
- **Frontend**: Auto-deploys to Vercel production
- **Backend**: Auto-deploys to Railway production
- **Mobile**: Builds production-ready APK/IPA

### Staging Environment  
- **Branch**: `develop`
- **Frontend**: Auto-deploys to Vercel preview
- **Backend**: Deploys to Railway staging
- **Mobile**: Builds development version

### Development Environment
- **Local**: Use `npm start` in each folder
- **API**: `http://localhost:4000`
- **Frontend**: `http://localhost:3000`
- **Mobile**: Expo development server

## 🔧 **Environment Variables**

### Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.railway.app
```

### Mobile (.env):
```env
EXPO_PUBLIC_API_URL=https://your-api-domain.railway.app
```

### API (.env):
```env
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-secure
NODE_ENV=production
PORT=4000
```

## 📱 **Mobile App Distribution**

### Internal Testing (Preview Builds)
```bash
# Build preview APK for testing
eas build --platform android --profile preview

# Share with testers via Expo dashboard
```

### App Store Distribution
```bash
# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 🔍 **Monitoring & Debugging**

### Deployment Status
- **Frontend**: [Vercel Dashboard](https://vercel.com/dashboard)
- **Backend**: [Railway Dashboard](https://railway.app/dashboard)
- **Mobile**: [Expo Dashboard](https://expo.dev/)
- **CI/CD**: GitHub Actions tab in your repository

### Logs Access
```bash
# Railway logs
railway logs --project-id YOUR_PROJECT_ID

# Vercel logs  
vercel logs https://your-app.vercel.app

# Expo logs
eas build:view [BUILD_ID]
```

### Common Issues & Solutions

#### 🐛 API Connection Issues
```bash
# Check if API is responding
curl https://your-api-domain.railway.app/api/products

# Fix: Update API URL in frontend environment variables
```

#### 🐛 Build Failures
```bash
# Check GitHub Actions logs
# Usually caused by:
# - Missing environment variables
# - Node version mismatches  
# - Dependencies not installed
```

#### 🐛 Mobile Build Issues
```bash
# Clear Expo cache
expo r -c

# Check EAS build logs
eas build:view [BUILD_ID]
```

## 🎯 **Production Checklist**

### Before Going Live:
- [ ] All environment variables set
- [ ] API endpoints tested
- [ ] Frontend builds successfully
- [ ] Mobile app builds successfully
- [ ] CI/CD pipeline tested
- [ ] Custom domain configured (optional)
- [ ] SSL certificates verified
- [ ] Performance testing completed
- [ ] Security review completed

### After Deployment:
- [ ] All URLs working
- [ ] Database seeded with test data
- [ ] Authentication working
- [ ] Checkout flow tested
- [ ] Mobile app downloadable
- [ ] CI/CD triggering correctly

## 🆘 **Getting Help**

### Deployment Support:
- **Vercel**: [Documentation](https://vercel.com/docs)
- **Railway**: [Documentation](https://docs.railway.app)
- **Expo**: [Documentation](https://docs.expo.dev)

### Project Issues:
- Check GitHub Issues in your repository
- Review deployment logs
- Test locally first

---

## 🎉 **Success!**

Once deployed, you'll have:
- ✅ **Live web application** on Vercel
- ✅ **API backend** running on Railway  
- ✅ **Mobile app** available via Expo
- ✅ **Automated CI/CD** with GitHub Actions
- ✅ **Professional deployment setup**

**Your e-commerce platform is now live and ready for users!** 🚀

### Share Your Success:
- Frontend: `https://your-project-name.vercel.app`
- API: `https://your-api-domain.railway.app`
- Mobile: Share Expo build link

**Congratulations on deploying a production-ready e-commerce platform!** 🎊