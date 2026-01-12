# The Notes - Cloud Deployment Guide

[![Deploy Frontend](https://github.com/Arun28856/the-notes/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/Arun28856/the-notes/actions/workflows/deploy-frontend.yml)
[![Deploy Backend](https://github.com/Arun28856/the-notes/actions/workflows/deploy-backend.yml/badge.svg)](https://github.com/Arun28856/the-notes/actions/workflows/deploy-backend.yml)

A full-stack notes application deployed to the cloud with public URLs.

## 🌐 Live Deployment

- **Frontend**: Deployed on Vercel - https://the-notes-app-nine.vercel.app
- **Backend API**: Deployed on Railway - https://the-notes-production.up.railway.app

## 🏗️ Architecture

This application consists of three main components:

- **Frontend**: React + Vite application
- **Backend**: Express.js REST API
- **Auth**: Authentication service

## 🚀 Automated Deployment

This repository uses GitHub Actions for continuous deployment:

### Frontend Deployment (Vercel)
- Automatically deploys on push to `main` branch when frontend files change
- Manual deployment available via workflow dispatch
- Build artifacts are served via Vercel CDN

### Backend Deployment (Railway)
- Automatically deploys on push to `main` branch when backend files change
- Manual deployment available via workflow dispatch
- Runs on Railway's infrastructure with auto-scaling

## 📋 Setup Instructions

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)
- MongoDB Atlas account (for database)
- Upstash account (for Redis/rate limiting)

### 1. Fork/Clone Repository

```bash
git clone https://github.com/Arun28856/the-notes.git
cd the-notes
```

### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### For Frontend (Vercel):
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `VITE_API_URL`: Your backend API URL (e.g., https://your-backend.railway.app)

#### For Backend (Railway):
- `RAILWAY_TOKEN`: Your Railway API token

### 3. Environment Variables

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.railway.app
```

#### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
```

### 4. Deploy to Vercel (Frontend)

#### Option 1: Using GitHub Actions (Recommended)
1. Configure GitHub secrets as mentioned above
2. Push to main branch or trigger workflow manually
3. GitHub Actions will automatically build and deploy

#### Option 2: Using Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

#### Option 3: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set root directory to `frontend`
5. Configure environment variables
6. Deploy

### 5. Deploy to Railway (Backend)

#### Option 1: Using GitHub Actions (Recommended)
1. Configure GitHub secrets as mentioned above
2. Push to main branch or trigger workflow manually
3. GitHub Actions will automatically deploy

#### Option 2: Using Railway CLI
```bash
cd backend
npm install -g @railway/cli
railway login
railway link
railway up
```

#### Option 3: Using Railway Dashboard
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory to `backend`
6. Configure environment variables
7. Deploy

### 6. Configure Custom Domains (Optional)

#### Vercel:
1. Go to your project settings in Vercel
2. Navigate to Domains
3. Add your custom domain
4. Update DNS records as instructed

#### Railway:
1. Go to your project settings in Railway
2. Navigate to Settings → Networking
3. Add custom domain
4. Update DNS records as instructed

## 🔧 Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Access at: http://localhost:5173

### Backend
```bash
cd backend
npm install
npm run dev
```
Access at: http://localhost:8080

### Auth Service
```bash
cd auth
npm install
npm run dev
```

## 📝 Manual Deployment

To manually trigger deployments:

1. Go to GitHub Actions tab in your repository
2. Select the workflow you want to run
3. Click "Run workflow"
4. Choose the branch and run

## 🔐 Security Notes

- Never commit `.env` files to the repository
- Use GitHub Secrets for sensitive information
- Rotate API keys and tokens regularly
- Enable 2FA on all cloud provider accounts

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, DaisyUI
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, Passport.js, Google OAuth
- **Deployment**: Vercel (Frontend), Railway (Backend)
- **CI/CD**: GitHub Actions

## 📦 Project Structure

```
the-notes/
├── frontend/           # React frontend application
│   ├── src/
│   ├── public/
│   ├── vercel.json    # Vercel configuration
│   └── package.json
├── backend/           # Express.js backend API
│   ├── src/
│   ├── Procfile       # Railway configuration
│   ├── nixpacks.toml  # Railway build configuration
│   └── package.json
├── auth/              # Authentication service
│   ├── server/
│   ├── routes/
│   └── package.json
└── .github/
    └── workflows/     # GitHub Actions workflows
        ├── deploy-frontend.yml
        └── deploy-backend.yml
```

## 🐛 Troubleshooting

### Frontend Build Fails
- Check that all dependencies are installed
- Verify environment variables are set correctly
- Review build logs in GitHub Actions

### Backend Deployment Fails
- Verify MongoDB connection string is correct
- Check that all required environment variables are set
- Review deployment logs in Railway dashboard

### CORS Errors
- Ensure backend CORS is configured with correct frontend URL
- Update allowed origins in backend server.js

## 📄 License

ISC

## 👤 Author

Lakshman Arun P

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue in the GitHub repository.
