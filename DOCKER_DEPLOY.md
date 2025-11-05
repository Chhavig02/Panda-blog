# 🐳 Docker Deployment Guide

## ✅ Prerequisites

### 1. Install Docker Desktop
1. Download: https://www.docker.com/products/docker-desktop/
2. Install Docker Desktop for Windows
3. Start Docker Desktop
4. Verify: Open PowerShell and run:
   ```bash
   docker --version
   docker compose version
   ```

### 2. Verify Installation
```bash
docker ps
docker compose version
```

## 🚀 Quick Start

### Option 1: Direct Docker Compose (Recommended)

```bash
cd c:\Users\Rocky\Desktop\fullstack

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Option 2: Build and Start

```bash
cd c:\Users\Rocky\Desktop\fullstack

# Build all images
docker compose build

# Start services
docker compose up -d

# Check logs
docker compose logs -f gateway
```

## ⚠️ Important: Environment Variables

Docker Compose uses environment variables from `docker-compose.yml`. 

### Current Setup:
- ✅ MongoDB Atlas connection strings are already in docker-compose.yml
- ✅ Service URLs are configured for Docker networking
- ⚠️ **JWT_SECRET** needs to be changed (currently default)

### To Update Environment Variables:

1. **Edit `docker-compose.yml`** directly, OR
2. **Create `.env` file** in root directory (Docker Compose will read it):

```env
# .env file (create this in root directory)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI_USER=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/user-service?retryWrites=true&w=majority
MONGODB_URI_POST=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/post-service?retryWrites=true&w=majority
MONGODB_URI_COMMENT=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/comment-service?retryWrites=true&w=majority
```

Then update docker-compose.yml to use `${JWT_SECRET}` syntax.

## 📋 Step-by-Step Deployment

### Step 1: Install Docker Desktop
- Download and install from: https://www.docker.com/products/docker-desktop/
- Make sure Docker Desktop is running (green icon in system tray)

### Step 2: Navigate to Project
```bash
cd c:\Users\Rocky\Desktop\fullstack
```

### Step 3: Start Services
```bash
docker compose up -d
```

**What this does:**
- Builds all Docker images (if not already built)
- Starts all containers:
  - User Service (port 5001)
  - Post Service (port 5002)
  - Comment Service (port 5003)
  - API Gateway (port 5000)
  - Frontend (port 3000)
  - MongoDB instances (if using local MongoDB)

### Step 4: Verify Services
```bash
# Check all containers are running
docker compose ps

# Check logs
docker compose logs -f

# Test API Gateway
curl http://localhost:5000/health
# Or open in browser: http://localhost:5000/health
```

### Step 5: Access Application
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **User Service**: http://localhost:5001
- **Post Service**: http://localhost:5002
- **Comment Service**: http://localhost:5003

## 🔧 Troubleshooting

### Docker Desktop Not Running
- Make sure Docker Desktop is started
- Check system tray for Docker icon
- Restart Docker Desktop if needed

### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use the kill-ports.bat script
.\kill-ports.bat
```

### Build Fails
```bash
# Clean build (removes cache)
docker compose build --no-cache

# Then start again
docker compose up -d
```

### MongoDB Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify connection string in docker-compose.yml
- Check if MongoDB Atlas cluster is running

### Services Not Starting
```bash
# Check logs for specific service
docker compose logs user-service
docker compose logs post-service
docker compose logs gateway

# Restart a specific service
docker compose restart gateway
```

### Clean Slate (Remove Everything)
```bash
# Stop and remove all containers, networks, volumes
docker compose down -v

# Remove all images
docker compose down --rmi all

# Then rebuild and start fresh
docker compose up -d --build
```

## 📝 Docker Commands Reference

```bash
# Start all services (detached mode)
docker compose up -d

# Start and see logs
docker compose up

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Restart specific service
docker compose restart gateway

# View logs
docker compose logs -f
docker compose logs -f gateway

# Check status
docker compose ps

# Build images
docker compose build

# Rebuild specific service
docker compose build gateway
docker compose up -d gateway

# Execute command in container
docker compose exec gateway sh
docker compose exec user-service node dist/index.js
```

## 🎯 What Gets Installed Automatically

When you run `docker compose up`:
1. ✅ Docker downloads base images (Node.js, MongoDB)
2. ✅ Installs all npm dependencies (from package.json)
3. ✅ Builds TypeScript code (runs `npm run build`)
4. ✅ Starts all services
5. ✅ Sets up networking between services

**You don't need to install anything manually!**

## ⚙️ Configuration

### Update docker-compose.yml for Production

1. **Change JWT_SECRET**:
   ```yaml
   environment:
     JWT_SECRET: your-actual-secret-key-here
   ```

2. **Update CORS_ORIGIN** (in gateway):
   ```yaml
   environment:
     CORS_ORIGIN: https://your-frontend-domain.com
   ```

3. **Use MongoDB Atlas** (already configured):
   - Connection strings are in docker-compose.yml
   - Make sure IP whitelist includes your server IP

## 🚀 Production Deployment

For production on a VPS:

1. **SSH into server**
2. **Install Docker**:
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo apt-get install docker-compose-plugin
   ```

3. **Clone repository**:
   ```bash
   git clone https://github.com/Chhavig02/Panda-blog.git
   cd Panda-blog
   ```

4. **Update docker-compose.yml** with production values

5. **Start services**:
   ```bash
   docker compose up -d
   ```

6. **Set up reverse proxy** (Nginx) for domain

## ✅ Quick Checklist

- [ ] Docker Desktop installed and running
- [ ] Navigate to project directory
- [ ] Run `docker compose up -d`
- [ ] Check services are running: `docker compose ps`
- [ ] Test API Gateway: http://localhost:5000/health
- [ ] Test Frontend: http://localhost:3000
- [ ] Update MongoDB Atlas IP whitelist if needed

## 🎉 That's It!

Just run:
```bash
docker compose up -d
```

And everything will be set up automatically! 🚀

