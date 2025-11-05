# 🐼 Panda Blog Platform

A microservices-based blogging platform with a beautiful panda theme, built with Node.js, Express, MongoDB, and React/Next.js.

## ✨ Features

- 🐼 **Panda-themed UI** with dark/light mode support
- 📝 **Blog Posts** with views, likes, and ranking system
- 💬 **Comments** on posts with full CRUD operations
- 🎯 **Token-based Premium Features** including blog editing
- 🤖 **AI Bot** for assistance (integrated in UI)
- 🔐 **Registration-based Authentication** (no login required - tokens issued at registration)
- 📊 **Ranking System** based on views and likes (formula: views * 0.3 + likes * 2)
- 🎨 **Modern UI Components**:
  - Animated Sidebar with hover effects
  - Expandable Tabs navigation
  - Cinematic Theme Switcher
- 👑 **Premium Features**: Premium users can create premium posts and edit their blogs

## 🏗️ Architecture

### Microservices
- **User Service** (Port 5001): User registration, profiles, token management, premium upgrades
- **Post Service** (Port 5002): Blog post CRUD, views tracking, likes, ranking calculation
- **Comment Service** (Port 5003): Comment management for posts
- **API Gateway** (Port 5000): Routes all requests, handles authentication, rate limiting, CORS

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component structure
- **Framer Motion** for animations
- **next-themes** for theme management

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Local Development

```bash
# Install dependencies
make install
# or
npm install

# Start all services
npm run dev

# Or start individually
npm run dev:gateway
npm run dev:user
npm run dev:post
npm run dev:comment
npm run dev:frontend
```

## 📍 Services & Ports

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **User Service**: http://localhost:5001
- **Post Service**: http://localhost:5002
- **Comment Service**: http://localhost:5003

## 🗄️ Database

The project uses MongoDB Atlas with separate databases for each service:
- `panda-blog-users` - User data
- `panda-blog-posts` - Post data
- `panda-blog-comments` - Comment data

Connection string is configured in `docker-compose.yml`.

## 📚 API Documentation

### User Service
- `POST /api/v1/users/register` - Register new user (returns token)
- `GET /api/v1/users/profile/:id` - Get user profile
- `PUT /api/v1/users/profile/:id` - Update profile (auth required)
- `POST /api/v1/users/tokens/add` - Add tokens (auth required)
- `POST /api/v1/users/premium/upgrade` - Upgrade to premium (50 tokens, auth required)

### Post Service
- `GET /api/v1/posts` - List all posts (supports pagination, search, sorting)
- `GET /api/v1/posts/top` - Get top ranked posts
- `GET /api/v1/posts/:id` - Get post by ID (auto-increments views)
- `POST /api/v1/posts` - Create post (auth required)
- `PUT /api/v1/posts/:id` - Update post (auth required, author only)
- `DELETE /api/v1/posts/:id` - Delete post (auth required, author only)
- `POST /api/v1/posts/:id/like` - Like/unlike post (auth required)

### Comment Service
- `GET /api/v1/comments/:postId` - Get comments for a post
- `POST /api/v1/comments/:postId` - Create comment (auth required)
- `PUT /api/v1/comments/:id` - Update comment (auth required, author only)
- `DELETE /api/v1/comments/:id` - Delete comment (auth required, author only)

## 🎯 Premium Features

- **Premium Posts**: Premium users can mark posts as premium
- **Blog Editing**: Premium users can edit their blog posts
- **Token System**: Users start with 10 tokens, can add more
- **Upgrade Cost**: 50 tokens to upgrade to premium

## 🤖 AI Bot

The AI bot is integrated in the frontend. Click the "AI Bot" tab in the navigation to open the chat interface. (Currently uses a demo response - ready for OpenAI/other API integration)

## 🛠️ Development

```bash
# Build all services
make build

# Run seed script (after services are running)
node scripts/seed.js

# Clean up Docker
make clean
```

## 📦 Project Structure

```
.
├── services/
│   ├── user-service/      # User microservice
│   ├── post-service/      # Post microservice
│   ├── comment-service/   # Comment microservice
│   └── gateway/           # API Gateway
├── frontend/              # Next.js frontend
├── scripts/               # Utility scripts
├── docker-compose.yml     # Docker orchestration
└── Makefile              # Build commands
```

## 🔧 Configuration

- MongoDB connection string is in `docker-compose.yml`
- JWT secret should be changed in production
- CORS origin configured in gateway
- All services use environment variables for configuration

## 📝 Notes

- No login system - users register and receive a token
- Tokens expire after 24 hours (configurable)
- Ranking formula: `(views * 0.3) + (likes * 2)`
- Services communicate via REST APIs
- Each service has its own MongoDB database

## 📄 License

MIT

## 🆘 Support

See `SETUP.md` for detailed setup instructions and troubleshooting.

