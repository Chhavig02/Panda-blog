# 🚀 Quick Authentication Fix

## Problem:
Git is using wrong credentials (`ccpsddn` instead of `Chhavig02`)

## ✅ Quick Fix:

### Method 1: Clear Old Credentials (Recommended)

1. **Open Windows Credential Manager**:
   - Press `Win + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Press Enter

2. **Find and Delete**:
   - Click **"Windows Credentials"**
   - Look for: `git:https://github.com`
   - Click **"Remove"**

3. **Push Again**:
   ```bash
   cd c:\Users\Rocky\Desktop\fullstack
   git push -u origin main
   ```
   - **Username**: `Chhavig02`
   - **Password**: Use **Personal Access Token** (not your GitHub password)

### Method 2: Generate Token & Push

1. **Get Token**: https://github.com/settings/tokens
   - Generate new token (classic)
   - Check `repo` permissions
   - Copy token

2. **Push**:
   ```bash
   cd c:\Users\Rocky\Desktop\fullstack
   git push -u origin main
   ```
   - Username: `Chhavig02`
   - Password: **Paste the token** (not your password!)

### Method 3: Use SSH (Alternative)

```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: https://github.com/settings/keys
# Copy public key: type ~/.ssh/id_ed25519.pub

# Change remote to SSH
git remote set-url origin git@github.com:Chhavig02/panda-blog.git

# Push
git push -u origin main
```

## 🎯 Recommended: Use Method 1 + Personal Access Token

This is the easiest and most secure way!

