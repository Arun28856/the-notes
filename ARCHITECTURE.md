# Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          GitHub Repository                           │
│                      github.com/Arun28856/the-notes                 │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         │ git push
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Actions                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Frontend   │  │   Backend    │  │     Auth     │              │
│  │   Workflow   │  │   Workflow   │  │   Workflow   │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼──────────────────┼──────────────────┼─────────────────────┘
          │                  │                  │
          │ Deploy           │ Deploy           │ Deploy
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│     Vercel       │ │     Railway      │ │     Railway      │
│   (Frontend)     │ │    (Backend)     │ │      (Auth)      │
│                  │ │                  │ │                  │
│  ┌────────────┐  │ │  ┌────────────┐  │ │  ┌────────────┐  │
│  │   React    │  │ │  │  Express   │  │ │  │  Express   │  │
│  │  + Vite    │  │ │  │    API     │  │ │  │   Auth     │  │
│  └────────────┘  │ │  └────────────┘  │ │  └────────────┘  │
│                  │ │                  │ │                  │
│  Global CDN      │ │  Auto-scaling    │ │  JWT + OAuth     │
└────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
         │                    │                     │
         │ HTTPS              │ HTTPS API           │ HTTPS
         │                    │ Calls               │
         ▼                    │                     │
┌──────────────────┐          │                     │
│      Users       │          │                     │
│   (Browsers)     │──────────┘                     │
└──────────────────┘                                │
         │                                          │
         └──────────────────────────────────────────┘
                    Authentication Flow


External Services:
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  MongoDB Atlas │  │    Upstash     │  │  Google OAuth  │   │
│  │   (Database)   │  │    (Redis)     │  │   (Auth)       │   │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘   │
│           │                   │                    │           │
└───────────┼───────────────────┼────────────────────┼───────────┘
            │                   │                    │
            └───────────────────┴────────────────────┘
                    Connected to Backend/Auth


Deployment Flow:
═══════════════════════════════════════════════════════════════

Step 1: Developer Action
    Developer → git push → GitHub Repository

Step 2: Automated Build
    GitHub Actions Triggered
        ├─→ Frontend Workflow (on frontend/** changes)
        ├─→ Backend Workflow (on backend/** changes)
        └─→ Auth Workflow (on auth/** changes)

Step 3: Deployment
    Workflows Deploy to:
        ├─→ Vercel (Frontend - Static files + CDN)
        ├─→ Railway (Backend API - Node.js server)
        └─→ Railway (Auth Service - Node.js server)

Step 4: Live Application
    Public URLs Active:
        ├─→ https://your-app.vercel.app (Frontend)
        ├─→ https://your-backend.railway.app (Backend)
        └─→ https://your-auth.railway.app (Auth)


Traffic Flow:
═════════════════════════════════════════════════════════════

1. User visits https://your-app.vercel.app
2. Vercel CDN serves React app (HTML, CSS, JS)
3. React app makes API calls to Railway backend
4. Backend validates JWT tokens
5. Backend queries MongoDB for data
6. Backend uses Redis for rate limiting
7. Response sent back through the chain
8. User sees updated UI


Alternative Deployment with Docker:
═════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────┐
│                   Docker Compose                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Frontend    │  │   Backend    │  │     Auth     │  │
│  │  Container   │  │   Container  │  │   Container  │  │
│  │  (Nginx)     │  │   (Node)     │  │   (Node)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                       │
                       ├─→ Deploy to AWS ECS
                       ├─→ Deploy to GCP Cloud Run
                       ├─→ Deploy to Azure Container Instances
                       ├─→ Deploy to DigitalOcean
                       └─→ Deploy to any Docker host
```

## Key Features

✅ **Continuous Deployment** - Automatic updates on git push
✅ **Global CDN** - Fast content delivery worldwide (Vercel)
✅ **Auto-scaling** - Handles traffic spikes (Railway)
✅ **HTTPS** - Secure by default
✅ **Environment Variables** - Secure config management
✅ **Rate Limiting** - Protection via Upstash Redis
✅ **Database** - MongoDB Atlas with replication
✅ **Authentication** - JWT + Google OAuth

## URL Structure

- **Frontend**: `https://{project-name}.vercel.app`
- **Backend**: `https://{project-name}.up.railway.app`
- **Auth**: `https://{project-name}-auth.up.railway.app`

Custom domains can be configured in each platform's dashboard.
