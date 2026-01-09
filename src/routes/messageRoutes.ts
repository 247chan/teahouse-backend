import { Router } from 'express';
import { MessageController } from '../controllers/messageController';

const router = Router();

// POST /api/messages - Submit new message
router.post('/', MessageController.createMessage);

// GET /api/messages/my-submissions - Get user's submissions
router.get('/my-submissions', MessageController.getMySubmissions);

// DELETE /api/messages/:id - Delete pending message
router.delete('/:id', MessageController.deleteMessage);

export default router;