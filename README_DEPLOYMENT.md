# 🚀 Panda Blog - Deployment Guide

## 📦 Project Overview
Microservices-based blogging platform with Node.js, Express, MongoDB, and Next.js (React).

## 🔧 Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB Atlas
- **Architecture**: Microservices (User, Post, Comment, API Gateway)

## 📝 Token System
- **Registration**: 1 token
- **Post Creation**: 5 tokens
- **Like Received**: 1 token (post author gets 1 token per like)

## 🎯 Features
- User Registration & Authentication (Token-based)
- Blog Post Creation, Editing, Deletion
- Like & Share Posts
- Comments System
- Leaderboard
- Trending Posts
- Premium Features
- Dark/Light Theme (Purple-tinted light theme)

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Docker (optional, for containerized setup)

### Setup
1. Clone repository
2. Run `setup-env.ps1` (Windows) or create `.env` files manually
3. Install dependencies: `npm install` in each service directory
4. Start services: Use `start-all.bat` or run individually

## 📤 GitHub Deployment Steps

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Panda Blog Microservices Platform"
```

### 2. Create GitHub Repository
- Go to GitHub.com
- Click "New Repository"
- Name: `panda-blog` (or your preferred name)
- Don't initialize with README (we already have one)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/panda-blog.git
git branch -M main
git push -u origin main
```

## 🌐 Vercel Deployment (Frontend)

### Steps:
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. **Configure Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

6. **Environment Variables**:
   - Add: `NEXT_PUBLIC_API_URL`
   - Value: Your API Gateway URL (e.g., `https://your-api.railway.app`)

7. Click "Deploy"

### Backend Deployment Options

#### Option 1: Railway (Recommended)
- Free tier available
- Easy MongoDB Atlas connection
- Deploy each service separately

#### Option 2: Render
- Free tier available
- Automatic deployments

#### Option 3: Keep Backend Local
- Run backend services locally
- Use ngrok for tunneling
- Point frontend to tunnel URL

## 📋 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend Services (.env files)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Random secret string
- `USER_SERVICE_URL`: User service URL
- `POST_SERVICE_URL`: Post service URL
- `COMMENT_SERVICE_URL`: Comment service URL
- `CORS_ORIGIN`: Frontend URL

## 🔗 Service URLs (Local)
- API Gateway: `http://localhost:5000`
- User Service: `http://localhost:5001`
- Post Service: `http://localhost:5002`
- Comment Service: `http://localhost:5003`
- Frontend: `http://localhost:3000`

## 📁 Project Structure
```
fullstack/
├── frontend/          # Next.js frontend
├── services/
│   ├── user-service/  # User management
│   ├── post-service/  # Blog posts
│   ├── comment-service/ # Comments
│   └── gateway/       # API Gateway
├── docker-compose.yml # Docker orchestration
└── README.md          # Main documentation
```

## 🐳 Docker Setup
```bash
docker-compose up -d
```

## 📝 Notes
- All `.env` files are gitignored (security)
- Create `.env` files manually after cloning
- MongoDB Atlas IP whitelist must include deployment IPs
- Frontend automatically refreshes tokens after actions

## 🆘 Troubleshooting
- **MongoDB Connection**: Check IP whitelist in Atlas
- **Port Conflicts**: Use `kill-ports.bat` to free ports
- **Build Errors**: Check Node.js version (18+ required)
- **CORS Issues**: Verify `CORS_ORIGIN` in gateway

## 📞 Support
Check `DEPLOYMENT.md` for detailed deployment instructions.

