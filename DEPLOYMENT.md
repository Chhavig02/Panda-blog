# Vercel Deployment Guide

## 🚀 Deployment Steps

### Prerequisites
1. Vercel account (free tier works)
2. MongoDB Atlas cluster (already set up)
3. All backend services running (or deployed separately)

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory: `frontend`
   - Add environment variable:
     - `NEXT_PUBLIC_API_URL`: Your API Gateway URL (e.g., `https://your-api.railway.app` or `https://your-api.herokuapp.com`)

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

### Backend Deployment Options

#### Option 1: Railway (Recommended)
- Free tier available
- Easy MongoDB Atlas connection
- Deploy each service separately

#### Option 2: Render
- Free tier available
- Automatic deployments
- MongoDB Atlas compatible

#### Option 3: Heroku
- Paid option (or free with limitations)
- Good for production

#### Option 4: Keep Backend Local
- Run backend services locally
- Use ngrok or similar for tunneling
- Point frontend to tunnel URL

### Environment Variables for Backend

Each service needs:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Random secret string
- Service URLs (for inter-service communication)

### Important Notes

⚠️ **Current Setup**: 
- Backend services are designed for Docker Compose (local development)
- For production, you'll need to:
  1. Deploy each service separately, OR
  2. Use a platform that supports Docker Compose, OR
  3. Keep backend local and use tunneling

### Recommended Setup

1. **Frontend**: Deploy to Vercel ✅
2. **Backend Services**: Deploy to Railway/Render
   - User Service
   - Post Service
   - Comment Service
   - API Gateway
3. **Database**: MongoDB Atlas (already set up) ✅

### API Gateway URL

After deploying backend, update `NEXT_PUBLIC_API_URL` in Vercel:
- Example: `https://your-api-gateway.railway.app`
- Or: `https://your-api-gateway.render.com`

### Testing After Deployment

1. Check if frontend loads
2. Test registration
3. Test post creation
4. Test like/share functionality
5. Verify tokens are updating

