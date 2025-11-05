import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import { authenticate } from './middleware/auth';
import { proxyRequest } from './middleware/proxy';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'api-gateway' });
});

// Rate limiting
app.use(rateLimiter);

// Service routes
const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:5001',
  post: process.env.POST_SERVICE_URL || 'http://localhost:5002',
  comment: process.env.COMMENT_SERVICE_URL || 'http://localhost:5003',
};

// User service routes
app.post('/api/v1/users/register', proxyRequest(services.user));
app.get('/api/v1/users/profile/:id', proxyRequest(services.user));
app.put('/api/v1/users/profile/:id', authenticate, proxyRequest(services.user));
app.post('/api/v1/users/tokens/add', authenticate, proxyRequest(services.user));
app.post('/api/v1/users/premium/upgrade', authenticate, proxyRequest(services.user));
app.get('/api/v1/users/leaderboard', proxyRequest(services.user));

// Post service routes
app.get('/api/v1/posts', proxyRequest(services.post));
app.get('/api/v1/posts/top', proxyRequest(services.post));
app.get('/api/v1/posts/:id', proxyRequest(services.post));
app.post('/api/v1/posts', authenticate, proxyRequest(services.post));
app.put('/api/v1/posts/:id', authenticate, proxyRequest(services.post));
app.delete('/api/v1/posts/:id', authenticate, proxyRequest(services.post));
app.post('/api/v1/posts/:id/like', authenticate, proxyRequest(services.post));
app.post('/api/v1/posts/:id/share', authenticate, proxyRequest(services.post));

// Comment service routes
app.get('/api/v1/comments/:postId', proxyRequest(services.comment));
app.post('/api/v1/comments/:postId', authenticate, proxyRequest(services.comment));
app.put('/api/v1/comments/:id', authenticate, proxyRequest(services.comment));
app.delete('/api/v1/comments/:id', authenticate, proxyRequest(services.comment));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

