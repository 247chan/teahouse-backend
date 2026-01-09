import { Router } from 'express';
import { FeedController } from '../controllers/feedController';

const router = Router();

// GET /api/feed - Get paginated feed
router.get('/', FeedController.getFeed);

// GET /api/feed/:id - Get single message
router.get('/:id', FeedController.getMessageById);

export default router;