# 🔧 Fix Vercel Environment Variable Error

## ❌ Error:
```
Environment Variable "NEXT_PUBLIC_API_URL" references Secret "api_url", which does not exist.
```

## ✅ Solution: Set Environment Variable Directly

### Step 1: Remove the Wrong Reference

1. In Vercel deployment page, click **"Cancel"** or go back
2. Go to your project settings

### Step 2: Add Environment Variable Correctly

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project (`Panda-blog`)

2. **Go to Settings:**
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in left sidebar

3. **Add Environment Variable:**
   - Click **"Add New"**
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Enter your ngrok URL directly (e.g., `https://abc123.ngrok-free.app`)
     - **⚠️ Don't use "Secret" - just type the URL directly!**
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

### Step 3: Redeploy

1. Go to **"Deployments"** tab
2. Click the **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger redeploy

## 🎯 Correct Way:

```
Key: NEXT_PUBLIC_API_URL
Value: https://your-ngrok-url.ngrok-free.app
Type: Plain Text (NOT Secret)
```

## ❌ Wrong Way:

```
Key: NEXT_PUBLIC_API_URL
Value: @api_url (referencing a secret)
```

## 🔄 Alternative: Set During Deployment

If you're in the deployment setup page:

1. **In the "Environment Variables" section:**
   - Click **"Add"** button
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Type your ngrok URL directly (e.g., `https://abc123.ngrok-free.app`)
   - **⚠️ Make sure you're typing the actual URL, not referencing a secret!**

2. **Then continue with deployment**

## 📝 Quick Steps:

1. **Get ngrok URL:**
   ```bash
   ngrok http 5000
   # Copy the HTTPS URL
   ```

2. **In Vercel:**
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-ngrok-url.ngrok-free.app`
   - Save

3. **Redeploy**

## 🆘 Still Having Issues?

### Option 1: Use Direct Value
- Don't use "Secret" option
- Type the URL directly in the "Value" field

### Option 2: Temporary Testing URL
For testing, you can use:
```
NEXT_PUBLIC_API_URL = http://localhost:5000
```
(This will only work if you're testing locally, not from Vercel)

### Option 3: Check Existing Variables
- Go to Settings → Environment Variables
- Check if `NEXT_PUBLIC_API_URL` already exists
- If it exists with wrong value, delete it and add again

## ✅ After Fix:

1. Environment variable set correctly
2. Redeploy project
3. Check deployment logs
4. Test your live app!

---

**Key Point:** Use the actual ngrok URL as the value, don't reference a secret!

