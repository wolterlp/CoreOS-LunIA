import { Router } from 'express';
import { VirtualSecretaryController } from './virtual-secretary.controller';
import { authMiddleware } from '../../../shared/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/events', VirtualSecretaryController.scheduleEvent);
router.get('/events', VirtualSecretaryController.listEvents);
router.get('/reminders', VirtualSecretaryController.listReminders);
router.patch('/reminders/:id/complete', VirtualSecretaryController.completeReminder);

export default router;
