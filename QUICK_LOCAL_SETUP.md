# ⚡ Quick Setup: Local Backend + Vercel Frontend

## 🎯 What You Need

1. **Docker Desktop** (already installed ✅)
2. **ngrok** (download from https://ngrok.com/download)
3. **Vercel account** (free)

## 🚀 3-Step Setup

### Step 1: Start Backend (Local)
```bash
cd c:\Users\Rocky\Desktop\fullstack
docker compose up -d
```
Wait for all services to start (check with `docker compose ps`)

### Step 2: Start ngrok Tunnel
```bash
# Download ngrok if not installed
# Then run:
ngrok http 5000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

### Step 3: Deploy to Vercel

1. Go to: https://vercel.com
2. **New Project** → Import `Chhavig02/Panda-blog`
3. **Root Directory**: `frontend`
4. **Environment Variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://abc123.ngrok-free.app` (your ngrok URL)
5. **Deploy**

## ✅ That's It!

- Backend: Running on your PC (via Docker)
- Frontend: Live on Vercel
- Connection: Vercel → ngrok → Your PC

## 🔄 If ngrok URL Changes

1. Get new URL from ngrok
2. Vercel → Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL`
4. Redeploy

## 📝 Files Created

- `start-ngrok.bat` - Quick ngrok starter
- `LOCAL_BACKEND_VERCEL_FRONTEND.md` - Detailed guide

---

**🎉 Ready to go!**

