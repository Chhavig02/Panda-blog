# 🚀 Local Backend + Vercel Frontend Setup

## 🎯 Goal
- ✅ Backend: Run locally (Docker or direct)
- ✅ Frontend: Deploy on Vercel
- ✅ Connect Vercel frontend to local backend using ngrok

## 📋 Step 1: Start Local Backend

### Option A: Using Docker (Recommended)

```bash
cd c:\Users\Rocky\Desktop\fullstack

# Start all backend services
docker compose up -d

# Verify services are running
docker compose ps

# Check Gateway is running
curl http://localhost:5000/health
```

### Option B: Run Services Directly (Without Docker)

Open 4 separate terminals:

**Terminal 1 - User Service:**
```bash
cd c:\Users\Rocky\Desktop\fullstack\services\user-service
npm install
npm run dev
```

**Terminal 2 - Post Service:**
```bash
cd c:\Users\Rocky\Desktop\fullstack\services\post-service
npm install
npm run dev
```

**Terminal 3 - Comment Service:**
```bash
cd c:\Users\Rocky\Desktop\fullstack\services\comment-service
npm install
npm run dev
```

**Terminal 4 - API Gateway:**
```bash
cd c:\Users\Rocky\Desktop\fullstack\services\gateway
npm install
npm run dev
```

## 🔗 Step 2: Expose Local Backend to Internet (ngrok)

### Install ngrok

1. Download ngrok: https://ngrok.com/download
2. Extract ngrok.exe
3. Add to PATH or place in project folder

### Start ngrok Tunnel

```bash
# Expose API Gateway (port 5000) to internet
ngrok http 5000
```

**Important:** ngrok will give you a URL like:
```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:5000
```

**Copy this URL** - This is your public API URL!

### Keep ngrok Running

- Keep the ngrok terminal window open
- The URL will change if you restart ngrok (unless you have paid plan)
- For free tier, URL changes on each restart

## 🌐 Step 3: Deploy Frontend to Vercel

### Step 3.1: Deploy Frontend

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click **"New Project"**
4. Import repository: `Chhavig02/Panda-blog`
5. **Configure:**
   - **Root Directory**: `frontend`
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

6. **Environment Variables:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://abc123.ngrok-free.app` (your ngrok URL)
   - Click **"Add"**

7. Click **"Deploy"**

### Step 3.2: Update CORS in Gateway

Edit `services/gateway/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',  // Add your Vercel URL
    process.env.CORS_ORIGIN || 'http://localhost:3000'
  ],
  credentials: true,
}));
```

Or update `docker-compose.yml`:
```yaml
environment:
  CORS_ORIGIN: https://your-vercel-app.vercel.app,http://localhost:3000
```

Then restart gateway:
```bash
docker compose restart api-gateway
```

## ⚙️ Step 4: Update MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. **Network Access** → **IP Access List**
3. Add your current IP address
4. **OR** add ngrok's IP ranges (if possible)
5. **OR** temporarily allow `0.0.0.0/0` (less secure, but works)

## 🔄 Step 5: Update ngrok URL in Vercel (When URL Changes)

If ngrok URL changes (free tier):

1. Get new ngrok URL
2. Go to Vercel Dashboard
3. **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL` with new ngrok URL
5. **Redeploy** frontend

## 📝 Alternative: Use ngrok with Static Domain (Paid)

If you have ngrok paid plan:
- Set up static domain
- URL won't change
- More reliable for production

## 🚀 Quick Start Commands

### Terminal 1: Start Backend
```bash
cd c:\Users\Rocky\Desktop\fullstack
docker compose up -d
```

### Terminal 2: Start ngrok
```bash
ngrok http 5000
# Copy the https:// URL
```

### Terminal 3: Update Vercel
1. Go to Vercel dashboard
2. Update `NEXT_PUBLIC_API_URL` with ngrok URL
3. Redeploy

## ✅ Verification

1. **Check Backend:**
   ```bash
   curl http://localhost:5000/health
   # Or open: http://localhost:5000/health
   ```

2. **Check ngrok:**
   ```bash
   # Open ngrok dashboard: http://localhost:4040
   # Or test: https://your-ngrok-url.ngrok-free.app/health
   ```

3. **Check Vercel Frontend:**
   - Open your Vercel URL
   - Try registering a user
   - Check if it connects to local backend

## 🔧 Troubleshooting

### ngrok Connection Failed
- Check if backend is running on port 5000
- Verify ngrok is running
- Check firewall settings

### CORS Errors
- Update CORS_ORIGIN in Gateway
- Add Vercel URL to allowed origins
- Restart gateway service

### MongoDB Connection Failed
- Check IP whitelist in Atlas
- Verify connection string
- Check if MongoDB Atlas cluster is running

### Frontend Can't Connect
- Verify ngrok URL is correct in Vercel
- Check ngrok is still running
- Check backend logs for errors

## 📋 Complete Setup Checklist

- [ ] Backend services running locally (Docker or direct)
- [ ] ngrok installed and running
- [ ] ngrok URL obtained
- [ ] Vercel frontend deployed
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] CORS updated in Gateway to allow Vercel domain
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Test registration from Vercel frontend
- [ ] Test post creation
- [ ] Verify all features working

## 🎯 Pro Tips

1. **Keep ngrok Running:**
   - Use a separate terminal window
   - Don't close it while testing

2. **Monitor Logs:**
   ```bash
   # Docker logs
   docker compose logs -f gateway
   
   # ngrok dashboard
   http://localhost:4040
   ```

3. **Update on Restart:**
   - If you restart ngrok, URL changes
   - Update Vercel environment variable
   - Redeploy frontend

4. **For Development:**
   - Use localhost for frontend too
   - Only use ngrok when deploying to Vercel

## 🆘 Alternative: Cloudflare Tunnel (Free)

If ngrok doesn't work, try Cloudflare Tunnel:

1. Install: `npm install -g cloudflared`
2. Run: `cloudflared tunnel --url http://localhost:5000`
3. Get URL and use in Vercel

---

## ✅ That's It!

Your setup:
- ✅ Backend: Running locally (accessible via ngrok)
- ✅ Frontend: Deployed on Vercel
- ✅ Connected: Vercel → ngrok → Local Backend

**🎉 Your app is live!**

