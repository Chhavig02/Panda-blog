# 🚨 QUICK FIX: MongoDB Atlas IP Whitelist

## Your Current IP Address
**49.249.148.158**

## Steps to Fix (2 minutes)

### 1. Go to MongoDB Atlas Network Access
👉 **Direct Link**: https://cloud.mongodb.com/v2#/security/network/list

### 2. Click "Add IP Address" Button

### 3. Choose One Option:

**✅ EASIEST OPTION (Recommended):**
- Click **"Add Current IP Address"** button
- Click **"Confirm"**
- Done! ✅

**OR Alternative (Quick Development Setup):**
- Enter: `0.0.0.0/0` 
- Click **"Confirm"**
- ⚠️ This allows ALL IPs (less secure, but good for development)

### 4. Wait 30-60 seconds

### 5. Restart Your Services
```bash
# Stop all services (Ctrl+C in each terminal)
# Then restart:
.\start-all.bat
```

## Expected Result
You should see:
```
✅ Connected to MongoDB
✅ User Service running on port 5001
✅ Post Service running on port 5002
✅ Comment Service running on port 5003
```

## If It Still Doesn't Work

1. **Double-check the IP is added** in MongoDB Atlas Network Access
2. **Wait 1-2 minutes** - MongoDB Atlas needs time to propagate changes
3. **Check your MongoDB password** - Make sure it's correct in the connection string
4. **Verify cluster is running** - Check MongoDB Atlas dashboard that cluster isn't paused

## Still Having Issues?

See detailed guide in: `MONGODB_IP_WHITELIST_FIX.md`

---

**Your IP to whitelist:** `49.249.148.158`

