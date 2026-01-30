# 🚂 Railway Deployment Guide

## Why Railway?

Railway is the **best option** for your SocialPulse application because:

- ✅ **One platform** for frontend, backend, and database
- ✅ **Free tier**: 512MB RAM, 1GB disk, PostgreSQL included
- ✅ **Full WebSocket support** for real-time features
- ✅ **Prisma ORM** works perfectly
- ✅ **Automatic deployments** from GitHub
- ✅ **Easy scaling** when you grow

## 🚀 Quick Deployment (5 minutes)

### 1. Create Railway Account
Go to [Railway.app](https://railway.app) and sign up with GitHub.

### 2. Create Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init socialpulse

# This will create 2 services automatically:
# - socialpulse (frontend)
# - socialpulse-backend (backend)
```

### 3. Connect Database
Railway automatically provisions a PostgreSQL database. The connection string will be available as an environment variable.

### 4. Set Environment Variables

In Railway dashboard → Your Project → Variables:

**Frontend (.env):**
```
NEXT_PUBLIC_API_URL=https://your-backend-service.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend-service.up.railway.app
```

**Backend (.env):**
```
NODE_ENV=production
PORT=8080
DATABASE_URL=${DATABASE_URL}  # Railway provides this automatically
REDIS_URL=redis://localhost:6379  # Optional: Railway can add Redis plugin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

### 5. Deploy
```bash
# Push to GitHub first
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin master

# Railway will auto-deploy on every push
```

## 📊 What Gets Deployed

### Frontend Service
- **Framework**: Next.js 14 with App Router
- **Port**: 3000 (Railway auto-detects)
- **Build**: `npm run build`
- **Start**: `npm run start`

### Backend Service
- **Framework**: Express.js + TypeScript
- **Port**: 8080
- **Database**: PostgreSQL (Railway provided)
- **Real-time**: Socket.IO enabled
- **Build**: `npm run build`
- **Start**: `npm run dev`

### Database
- **Type**: PostgreSQL
- **Storage**: 1GB free
- **Connection**: Automatic via `${DATABASE_URL}`

## 🔧 Post-Deployment Setup

### 1. Run Database Migrations
```bash
# Connect to your Railway backend service
railway connect

# Run Prisma migrations
npx prisma db push
```

### 2. Test the Application
- Frontend: `https://your-project.up.railway.app`
- Backend API: `https://your-backend-service.up.railway.app/api/v1/health`

### 3. Add Custom Domain (Optional)
In Railway dashboard → Settings → Domains

## 💰 Pricing

- **Free Tier**: Perfect for development
  - 512MB RAM per service
  - 1GB disk
  - PostgreSQL included
  - 100GB outbound transfer

- **Pro Tier**: $5/month when you need more resources

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check Railway environment variables
railway variables

# Test database connection
railway run npx prisma db push
```

### Build Failures
```bash
# Check build logs in Railway dashboard
# Make sure all dependencies are in package.json
```

### WebSocket Issues
- Railway supports WebSockets fully
- Check CORS settings in backend
- Verify Socket.IO configuration

## 🎯 Next Steps

1. **Deploy now** with the free tier
2. **Test all features** (auth, posts, analytics)
3. **Add Redis plugin** if you need caching (optional)
4. **Scale up** when you get users

Railway makes deployment **stupidly simple** - just push to GitHub and it works! 🚀