# 🚀 Backend Deployment Guide

## 📋 Services to Deploy

1. **User Service** (Port 5001)
2. **Post Service** (Port 5002)
3. **Comment Service** (Port 5003)
4. **API Gateway** (Port 5000) - Main entry point

## 🎯 Recommended: Railway Deployment

Railway is the easiest and most reliable option for microservices.

### Step 1: Sign Up for Railway

1. Go to: https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Deploy Each Service

#### A. Deploy User Service

1. Click **"New"** → **"GitHub Repo"**
2. Select your repository: `Chhavig02/Panda-blog`
3. **Root Directory**: `services/user-service`
4. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/user-service?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   PORT=5001
   NODE_ENV=production
   ```
5. Railway will auto-detect Node.js and deploy
6. Note the generated URL (e.g., `user-service-production.up.railway.app`)

#### B. Deploy Post Service

1. Click **"New"** → **"GitHub Repo"**
2. Select same repository
3. **Root Directory**: `services/post-service`
4. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/post-service?retryWrites=true&w=majority
   USER_SERVICE_URL=https://user-service-production.up.railway.app
   COMMENT_SERVICE_URL=https://comment-service-production.up.railway.app
   PORT=5002
   NODE_ENV=production
   ```
5. Note the generated URL

#### C. Deploy Comment Service

1. Click **"New"** → **"GitHub Repo"**
2. Select same repository
3. **Root Directory**: `services/comment-service`
4. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/comment-service?retryWrites=true&w=majority
   USER_SERVICE_URL=https://user-service-production.up.railway.app
   POST_SERVICE_URL=https://post-service-production.up.railway.app
   PORT=5003
   NODE_ENV=production
   ```
5. Note the generated URL

#### D. Deploy API Gateway

1. Click **"New"** → **"GitHub Repo"**
2. Select same repository
3. **Root Directory**: `services/gateway`
4. **Environment Variables**:
   ```
   USER_SERVICE_URL=https://user-service-production.up.railway.app
   POST_SERVICE_URL=https://post-service-production.up.railway.app
   COMMENT_SERVICE_URL=https://comment-service-production.up.railway.app
   JWT_SECRET=your-super-secret-jwt-key-change-this
   CORS_ORIGIN=https://your-vercel-frontend.vercel.app
   PORT=5000
   NODE_ENV=production
   ```
5. **This is your main API URL** - Use this in Vercel!

### Step 3: Update Vercel Frontend

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://gateway-production.up.railway.app
   ```
5. Redeploy frontend

---

## 🔄 Alternative: Render Deployment

### Step 1: Sign Up

1. Go to: https://render.com
2. Sign up with GitHub

### Step 2: Deploy Services

For each service (User, Post, Comment, Gateway):

1. Click **"New"** → **"Web Service"**
2. Connect GitHub repository
3. **Root Directory**: `services/[service-name]`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start` (or `node dist/index.js`)
6. Add environment variables (same as Railway)
7. Deploy

**Note**: Render free tier spins down after 15 minutes of inactivity.

---

## 🐳 Alternative: Docker on VPS

If you have a VPS (DigitalOcean, AWS, etc.):

1. SSH into your server
2. Clone repository
3. Install Docker & Docker Compose
4. Run: `docker-compose up -d`

```bash
git clone https://github.com/Chhavig02/Panda-blog.git
cd Panda-blog
# Create .env files for each service
docker-compose up -d
```

---

## 🔐 MongoDB Atlas Configuration

### Update IP Whitelist

1. Go to MongoDB Atlas Dashboard
2. **Network Access** → **IP Access List**
3. Add:
   - Railway IPs (or allow `0.0.0.0/0` for all - less secure)
   - Render IPs (if using Render)
   - Your VPS IP (if using VPS)

**Note**: For Railway/Render, you might need to allow all IPs temporarily.

---

## 📝 Environment Variables Summary

### User Service
```
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/user-service?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5001
NODE_ENV=production
```

### Post Service
```
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/post-service?retryWrites=true&w=majority
USER_SERVICE_URL=[User Service URL]
COMMENT_SERVICE_URL=[Comment Service URL]
PORT=5002
NODE_ENV=production
```

### Comment Service
```
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/comment-service?retryWrites=true&w=majority
USER_SERVICE_URL=[User Service URL]
POST_SERVICE_URL=[Post Service URL]
PORT=5003
NODE_ENV=production
```

### API Gateway
```
USER_SERVICE_URL=[User Service URL]
POST_SERVICE_URL=[Post Service URL]
COMMENT_SERVICE_URL=[Comment Service URL]
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=5000
NODE_ENV=production
```

---

## ✅ Verification Checklist

- [ ] All services deployed
- [ ] Environment variables set
- [ ] MongoDB Atlas IP whitelist updated
- [ ] API Gateway URL obtained
- [ ] Frontend updated with API Gateway URL
- [ ] Test registration endpoint
- [ ] Test post creation
- [ ] Test like/share functionality
- [ ] Verify token system working

---

## 🆘 Troubleshooting

### Service Not Starting
- Check build logs
- Verify environment variables
- Check Node.js version (should be 18+)

### MongoDB Connection Failed
- Check IP whitelist in Atlas
- Verify connection string format
- Check database name in connection string

### Inter-Service Communication Failed
- Verify service URLs are correct
- Check CORS settings
- Ensure all services are deployed and running

### CORS Errors
- Update `CORS_ORIGIN` in Gateway
- Add frontend URL to allowed origins

---

## 🎯 Quick Start Commands

### Railway (Recommended)
1. Sign up: https://railway.app
2. Deploy each service from GitHub repo
3. Set environment variables
4. Get API Gateway URL
5. Update Vercel frontend

### Render (Alternative)
1. Sign up: https://render.com
2. Deploy each service as Web Service
3. Set environment variables
4. Get API Gateway URL
5. Update Vercel frontend

---

## 📞 Next Steps

After backend deployment:
1. Test all endpoints
2. Update frontend with API Gateway URL
3. Test full flow (registration → post → like → share)
4. Monitor logs for errors

**🎉 Good luck with deployment!**

