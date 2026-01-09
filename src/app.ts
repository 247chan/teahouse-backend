import express, { Application } from 'express';
import cors from 'cors';
import feedRoutes from './routes/feedRoutes';
import messageRoutes from './routes/messageRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app: Application = express();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/feed', feedRoutes);
app.use('/api/messages', messageRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;