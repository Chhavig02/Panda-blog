# 🚂 Railway Quick Deployment Guide

## ✅ Step-by-Step Deployment

### Step 1: Sign Up for Railway

1. Go to: https://railway.app
2. Click **"Start a New Project"**
3. Sign in with **GitHub**
4. Authorize Railway to access your repositories

### Step 2: Deploy User Service

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select repository: **`Chhavig02/Panda-blog`**
3. Railway will detect it - click **"Configure"**
4. **Root Directory**: `services/user-service`
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`
7. **Environment Variables** (Settings → Variables):
   ```
   MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/user-service?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5001
   NODE_ENV=production
   ```
8. Click **"Deploy"**
9. Wait for deployment - **Copy the generated URL** (e.g., `user-service-production.up.railway.app`)

### Step 3: Deploy Post Service

1. Click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select same repository: **`Chhavig02/Panda-blog`**
3. **Root Directory**: `services/post-service`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/post-service?retryWrites=true&w=majority
   USER_SERVICE_URL=https://user-service-production.up.railway.app
   COMMENT_SERVICE_URL=https://comment-service-production.up.railway.app
   PORT=5002
   NODE_ENV=production
   ```
   **⚠️ Replace URLs with actual User Service URL from Step 2**
7. Deploy and **copy the URL**

### Step 4: Deploy Comment Service

1. Click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select same repository: **`Chhavig02/Panda-blog`**
3. **Root Directory**: `services/comment-service`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/comment-service?retryWrites=true&w=majority
   USER_SERVICE_URL=https://user-service-production.up.railway.app
   POST_SERVICE_URL=https://post-service-production.up.railway.app
   PORT=5003
   NODE_ENV=production
   ```
   **⚠️ Replace URLs with actual service URLs from previous steps**
7. Deploy and **copy the URL**

### Step 5: Deploy API Gateway (Main Entry Point)

1. Click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select same repository: **`Chhavig02/Panda-blog`**
3. **Root Directory**: `services/gateway`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   USER_SERVICE_URL=https://user-service-production.up.railway.app
   POST_SERVICE_URL=https://post-service-production.up.railway.app
   COMMENT_SERVICE_URL=https://comment-service-production.up.railway.app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=https://your-frontend.vercel.app
   PORT=5000
   NODE_ENV=production
   ```
   **⚠️ Replace all service URLs with actual URLs**
   **⚠️ Replace CORS_ORIGIN with your Vercel frontend URL**
7. Deploy and **copy the URL** - **THIS IS YOUR API GATEWAY URL!**

### Step 6: Update MongoDB Atlas IP Whitelist

1. Go to: https://cloud.mongodb.com
2. **Network Access** → **IP Access List**
3. Click **"Add IP Address"**
4. For Railway, you might need to allow all: `0.0.0.0/0` (less secure but works)
   - Or add specific Railway IP ranges (check Railway docs)

### Step 7: Update Vercel Frontend

1. Go to Vercel Dashboard
2. Select your frontend project
3. **Settings** → **Environment Variables**
4. Update or add:
   ```
   NEXT_PUBLIC_API_URL=https://gateway-production.up.railway.app
   ```
   **⚠️ Replace with actual Gateway URL from Step 5**
5. **Redeploy** frontend

---

## 📋 Deployment Checklist

- [ ] User Service deployed
- [ ] Post Service deployed
- [ ] Comment Service deployed
- [ ] API Gateway deployed
- [ ] All environment variables set
- [ ] Service URLs updated correctly
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Vercel frontend updated with Gateway URL
- [ ] Test registration endpoint
- [ ] Test post creation
- [ ] Test like/share functionality

---

## 🔍 Troubleshooting

### Build Fails
- Check build logs in Railway
- Verify Node.js version (should be 18+)
- Check if all dependencies are in package.json

### Service Not Starting
- Check deployment logs
- Verify environment variables are set
- Check MongoDB connection string format

### Inter-Service Communication Failed
- Verify service URLs are correct (use HTTPS URLs)
- Check CORS settings in Gateway
- Ensure all services are deployed and running

### MongoDB Connection Failed
- Check IP whitelist in Atlas
- Verify connection string format
- Check database name in connection string

---

## 🎯 Quick Reference: Service URLs Format

After deployment, Railway will generate URLs like:
- `https://user-service-production.up.railway.app`
- `https://post-service-production.up.railway.app`
- `https://comment-service-production.up.railway.app`
- `https://gateway-production.up.railway.app` ← **This is your main API URL**

Use these URLs in environment variables and Vercel!

---

## 🚀 Alternative: Render Deployment

If Railway doesn't work, use Render:
1. Go to: https://render.com
2. Sign up with GitHub
3. For each service: **New** → **Web Service**
4. Connect GitHub repo
5. Set Root Directory: `services/[service-name]`
6. Build: `npm install && npm run build`
7. Start: `npm start`
8. Add environment variables (same as Railway)

**Note**: Render free tier spins down after 15 min inactivity.

---

## ✅ Success!

After deployment:
1. Test API Gateway: `https://gateway-production.up.railway.app/health`
2. Update Vercel frontend
3. Test full flow: Register → Create Post → Like → Share

**🎉 Your backend is now live!**

