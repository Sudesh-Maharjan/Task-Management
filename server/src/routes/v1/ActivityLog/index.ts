import express from 'express'; 
import { createActivityLog, getActivityLogs } from './controller';

const router = express.Router();

router.post('/', createActivityLog);
router.get('/', getActivityLogs);

export default router;