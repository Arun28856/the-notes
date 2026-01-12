# Quick Deployment Guide

## 🚀 Deploy in 5 Minutes

This guide will help you deploy the entire application to the cloud with public URLs.

### Step 1: Create Accounts (Free Tier)

1. **Vercel** (for Frontend): https://vercel.com/signup
2. **Railway** (for Backend): https://railway.app
3. **MongoDB Atlas** (for Database): https://www.mongodb.com/cloud/atlas/register
4. **Upstash** (for Redis): https://upstash.com

### Step 2: Deploy Frontend to Vercel

**Method 1: One-Click Deploy**
1. Click the button below:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/the-notes&project-name=the-notes-app&root-directory=frontend)
   
   > **Note:** Replace `YOUR_USERNAME` with your GitHub username if you've forked this repository.
   
2. Connect your GitHub account
3. Configure environment variables:
   - `VITE_API_URL`: (Will be added after backend deployment)
4. Click Deploy

**Method 2: Vercel CLI**
```bash
cd frontend
npx vercel --prod
```

**Method 3: GitHub Integration**
1. Import project from GitHub in Vercel dashboard
2. Set root directory: `frontend`
3. Deploy

### Step 3: Deploy Backend to Railway

**Method 1: One-Click Deploy**
1. Click the button below:
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/the-notes&referralCode=railway)
   
   > **Note:** Replace `YOUR_USERNAME` with your GitHub username if you've forked this repository.
   
2. Connect your GitHub account
3. Set root directory: `backend`
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 8080
   - `UPSTASH_REDIS_REST_URL`: Your Upstash Redis URL
   - `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis token
   - `JWT_SECRET`: A secure random string
   - `FRONTEND_URL`: Your Vercel frontend URL
5. Deploy

**Method 2: Railway CLI**
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

### Step 4: Update Frontend Environment

1. Copy your Railway backend URL (e.g., `https://your-app.railway.app`)
2. Update Vercel environment variables:
   - `VITE_API_URL`: Your Railway backend URL
3. Redeploy frontend

### Step 5: Enable GitHub Actions (Optional)

To enable automatic deployments:

1. Go to your GitHub repository settings
2. Navigate to Secrets and variables → Actions
3. Add the following secrets:

**For Vercel:**
- `VERCEL_TOKEN`: Get from https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: Found in Vercel project settings
- `VERCEL_PROJECT_ID`: Found in Vercel project settings

**For Railway:**
- `RAILWAY_TOKEN`: Get from Railway project settings

### Step 6: Access Your Application

✅ **Frontend**: https://your-project.vercel.app
✅ **Backend API**: https://your-project.railway.app

## 🎉 You're Done!

Your application is now live with public URLs!

## 🔄 Automatic Deployments

Once GitHub Actions is configured:
- Push to `main` branch → Automatic deployment
- Changes to `frontend/` → Frontend deploys
- Changes to `backend/` → Backend deploys

## 📱 Alternative Deployment Options

### Netlify (Alternative to Vercel)
```bash
cd frontend
npm install -g netlify-cli
netlify deploy --prod
```

### Render (Alternative to Railway)
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory: `backend`
5. Add environment variables
6. Deploy

### Heroku (Alternative to Railway)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

## 🆘 Need Help?

- Check the full [README.md](./README.md) for detailed instructions
- Open an issue on GitHub
- Review deployment logs in Vercel/Railway dashboards

## 🔐 Important Security Tips

1. Never commit `.env` files
2. Use strong JWT secrets
3. Enable 2FA on all accounts
4. Regularly rotate API keys
5. Use environment variables for all secrets
