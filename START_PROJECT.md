# 🚀 Starting the Panda Blog Platform

## All Services Built Successfully! ✅

All microservices have been compiled and are ready to run.

## Quick Start Commands

### Option 1: Docker (Recommended - All Services at Once)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Local Development (Run Each Service)

#### Terminal 1 - User Service
```bash
cd services/user-service
npm run dev
```

#### Terminal 2 - Post Service
```bash
cd services/post-service
npm run dev
```

#### Terminal 3 - Comment Service
```bash
cd services/comment-service
npm run dev
```

#### Terminal 4 - API Gateway
```bash
cd services/gateway
npm run dev
```

#### Terminal 5 - Frontend
```bash
cd frontend
npm run dev
```

### Option 3: Using Root Scripts (Requires concurrently)

```bash
# From root directory
npm run dev
```

## Environment Variables

All services use environment variables. Defaults are set in docker-compose.yml, but you can create `.env` files:

### User Service (.env)
```
PORT=5001
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-users?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### Post Service (.env)
```
PORT=5002
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-posts?retryWrites=true&w=majority
USER_SERVICE_URL=http://localhost:5001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### Comment Service (.env)
```
PORT=5003
MONGODB_URI=mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/panda-blog-comments?retryWrites=true&w=majority
USER_SERVICE_URL=http://localhost:5001
POST_SERVICE_URL=http://localhost:5002
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### Gateway (.env)
```
PORT=5000
USER_SERVICE_URL=http://localhost:5001
POST_SERVICE_URL=http://localhost:5002
COMMENT_SERVICE_URL=http://localhost:5003
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Service URLs

Once started, access:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **User Service**: http://localhost:5001
- **Post Service**: http://localhost:5002
- **Comment Service**: http://localhost:5003

## Health Checks

Test if services are running:
```bash
curl http://localhost:5001/health  # User Service
curl http://localhost:5002/health  # Post Service
curl http://localhost:5003/health  # Comment Service
curl http://localhost:5000/health  # API Gateway
```

## Troubleshooting

1. **Port already in use**: Stop other services using those ports
2. **MongoDB connection**: Verify connection string is correct
3. **CORS errors**: Check CORS_ORIGIN in gateway matches frontend URL
4. **Build errors**: All services have been built successfully - should work!

## Next Steps

1. Start services (Docker or local)
2. Open http://localhost:3000 in browser
3. Register a new user
4. Create your first blog post!
5. Enjoy the panda-themed blogging platform 🐼

