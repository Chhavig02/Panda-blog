# 🔐 Fix Authentication Error

## ❌ Current Error:
```
remote: Permission to Chhavig02/panda-blog.git denied to ccpsddn.
fatal: unable to access 'https://github.com/Chhavig02/panda-blog.git/': The requested URL returned error: 403
```

## ✅ Solution: Use Personal Access Token

### Step 1: Generate Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note**: `panda-blog-push` (या कोई descriptive name)
4. **Expiration**: Choose duration (30 days, 60 days, etc.)
5. **Select scopes**: Check **`repo`** (full control of private repositories)
   - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
6. Click **"Generate token"**
7. **⚠️ IMPORTANT**: Copy the token immediately (it won't be shown again!)
   - Example: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Use Token to Push

#### Option A: Push with Token (Recommended)
```bash
cd c:\Users\Rocky\Desktop\fullstack

# When prompted for username, enter: Chhavig02
# When prompted for password, paste the TOKEN (not your GitHub password)
git push -u origin main
```

#### Option B: Update Git Credentials (Windows)
```bash
# Open Windows Credential Manager
# Search for "git:https://github.com"
# Remove old credentials
# Then push again - it will ask for new credentials
```

#### Option C: Use Token in URL (One-time)
```bash
# Replace YOUR_TOKEN with the actual token
git remote set-url origin https://YOUR_TOKEN@github.com/Chhavig02/panda-blog.git

# Push
git push -u origin main

# Then remove token from URL (for security)
git remote set-url origin https://github.com/Chhavig02/panda-blog.git
```

### Step 3: Verify Push

After successful push, check:
- https://github.com/Chhavig02/panda-blog
- All files should be visible
- Commit history should show

## 🔒 Security Notes:

1. **Never commit tokens** to Git
2. **Don't share tokens** publicly
3. **Use token only for authentication** - don't hardcode it
4. **Remove token from URL** after use (if using Option C)

## ✅ Alternative: Use GitHub CLI

If you have GitHub CLI installed:
```bash
gh auth login
gh repo create panda-blog --public --source=. --remote=origin --push
```

## 🆘 Still Having Issues?

1. **Check repository exists**: https://github.com/Chhavig02/panda-blog
2. **Verify you have access** to the repository
3. **Check if repository is private** - you need proper permissions
4. **Try using SSH instead** of HTTPS:
   ```bash
   git remote set-url origin git@github.com:Chhavig02/panda-blog.git
   ```

