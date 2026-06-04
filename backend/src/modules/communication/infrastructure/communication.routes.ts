import { Router } from 'express';
import { CommunicationController } from './communication.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/send', CommunicationController.sendMessage);
router.get('/conversations', CommunicationController.listConversations);
router.get('/conversations/:conversationId/messages', CommunicationController.getMessages);

export default router;
