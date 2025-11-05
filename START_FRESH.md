# 🚀 Start Fresh - All Ports Cleared!

## ✅ Ports Cleared Successfully

All processes using ports 3000, 5000, 5001, 5002, 5003 have been terminated.

## Quick Start Options

### Option 1: Use Restart Script (Recommended)
```bash
.\restart-all.bat
```

This will:
1. Kill any remaining processes on ports
2. Start all 5 services in separate windows
3. Wait for MongoDB connections

### Option 2: Manual Start (5 Terminals)

**Terminal 1 - User Service:**
```bash
cd services/user-service
npm run dev
```

**Terminal 2 - Post Service:**
```bash
cd services/post-service
npm run dev
```

**Terminal 3 - Comment Service:**
```bash
cd services/comment-service
npm run dev
```

**Terminal 4 - API Gateway:**
```bash
cd services/gateway
npm run dev
```

**Terminal 5 - Frontend:**
```bash
cd frontend
npm run dev
```

## Expected Output

After starting, you should see in each service:

**User Service:**
```
✅ Connected to MongoDB
✅ User Service running on port 5001
```

**Post Service:**
```
✅ Connected to MongoDB
✅ Post Service running on port 5002
```

**Comment Service:**
```
✅ Connected to MongoDB
✅ Comment Service running on port 5003
```

**API Gateway:**
```
✅ API Gateway running on port 5000
```

**Frontend:**
```
✅ Ready on http://localhost:3000
```

## Access the Application

Once all services show "running":
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000

## If You Get Port Errors Again

Run:
```bash
.\kill-ports.bat
```

Then restart services.

## Troubleshooting

### "Port already in use" error
- Run `.\kill-ports.bat` to free all ports
- Wait 2-3 seconds
- Start services again

### "MongoDB connection error"
- Check that your IP is whitelisted in MongoDB Atlas
- See `QUICK_FIX.md` for details

### Service not connecting
- Wait 10-15 seconds after starting
- Check MongoDB Atlas cluster is running
- Verify .env files exist in each service directory

## Next Steps

1. Start all services using `.\restart-all.bat`
2. Wait for all services to show "Connected to MongoDB"
3. Open http://localhost:3000 in your browser
4. Register a new user
5. Create your first blog post! 🐼

