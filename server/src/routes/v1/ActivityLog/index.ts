import express from 'express'; 
import { createActivityLog, getActivityLogs } from './controller';
import { checkActivityLogOwnership } from '../../../Middleware/ActivityLogMiddleware';
import { auth } from '../../../Middleware/auth';

const router = express.Router();

router.use(auth);
router.post('/', createActivityLog);
router.get('/', getActivityLogs);

export default router;