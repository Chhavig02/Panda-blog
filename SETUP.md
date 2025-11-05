# 🐼 Panda Blog Platform - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- MongoDB connection string (already configured in docker-compose.yml)

## Quick Start

### Option 1: Docker (Recommended)

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:5000

### Option 2: Local Development

1. **Install dependencies:**
   ```bash
   npm install
   make install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` files in each service directory
   - Update MongoDB connection strings if needed

3. **Start services:**
   ```bash
   npm run dev
   ```

## Services

- **User Service** (Port 5001): User registration and profile management
- **Post Service** (Port 5002): Blog post CRUD, views, likes, ranking
- **Comment Service** (Port 5003): Comment management
- **API Gateway** (Port 5000): Routes all requests
- **Frontend** (Port 3000): Next.js React application

## Features

✅ User registration (no login required)
✅ Blog post creation with views and likes
✅ Ranking system based on views and likes
✅ Comment system
✅ Token-based premium features
✅ AI bot assistant
✅ Premium blog editing features
✅ Dark/Light theme switcher
✅ Modern UI with panda theme

## API Endpoints

### User Service
- `POST /api/v1/users/register` - Register new user
- `GET /api/v1/users/profile/:id` - Get user profile
- `PUT /api/v1/users/profile/:id` - Update profile
- `POST /api/v1/users/tokens/add` - Add tokens
- `POST /api/v1/users/premium/upgrade` - Upgrade to premium

### Post Service
- `GET /api/v1/posts` - List all posts
- `GET /api/v1/posts/top` - Get top posts
- `GET /api/v1/posts/:id` - Get post by ID
- `POST /api/v1/posts` - Create post (auth required)
- `PUT /api/v1/posts/:id` - Update post (auth required)
- `DELETE /api/v1/posts/:id` - Delete post (auth required)
- `POST /api/v1/posts/:id/like` - Like post (auth required)

### Comment Service
- `GET /api/v1/comments/:postId` - Get comments for post
- `POST /api/v1/comments/:postId` - Create comment (auth required)
- `PUT /api/v1/comments/:id` - Update comment (auth required)
- `DELETE /api/v1/comments/:id` - Delete comment (auth required)

## Premium Features

- Premium users can create premium posts
- Premium users can edit their blog posts
- Token system for accessing premium features
- Upgrade to premium costs 50 tokens

## MongoDB Connection

The project uses MongoDB Atlas with the connection string:
```
mongodb+srv://chhavi02:(Chhavi19)@cluster0.s7w0e2d.mongodb.net/
```

Each service uses a separate database:
- `panda-blog-users`
- `panda-blog-posts`
- `panda-blog-comments`

## Development

### Running Locally

```bash
# Install all dependencies
make install

# Start all services in development mode
npm run dev

# Or start individually
npm run dev:gateway
npm run dev:user
npm run dev:post
npm run dev:comment
npm run dev:frontend
```

### Building

```bash
# Build all services
make build

# Or build individually
npm run build:services
npm run build:frontend
```

## Troubleshooting

1. **Port conflicts**: Make sure ports 3000, 5000, 5001, 5002, 5003 are available
2. **MongoDB connection**: Verify your MongoDB connection string is correct
3. **Docker issues**: Try `docker-compose down -v` and restart
4. **CORS errors**: Check that CORS_ORIGIN is set correctly in gateway service

## License

MIT

