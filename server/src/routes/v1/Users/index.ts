import { Router} from 'express';
import {sendOtp, register, login, getAllUsers, getUserById } from './controller';
const router = Router();
import refreshTokenRoute from '../Auth/index'

router.post('/send-otp', sendOtp);
router.post('/register', register);
router.post('/login', login);
router.get('/allusers', getAllUsers);
router.get('/allusers/:assigneeID', getUserById);
// router.get('/:taskId', getAssignedUsersByTaskId);
router.use(refreshTokenRoute);

export default router;