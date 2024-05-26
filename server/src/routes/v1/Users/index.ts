import { Router} from 'express';
import {sendOtp, register, login, getAllUsers } from './controller';
const router = Router();
import refreshTokenRoute from '../Auth/index'

router.post('/send-otp', sendOtp);
router.post('/register', register);
router.post('/login', login);
router.get('/allusers', getAllUsers);
router.use(refreshTokenRoute);

export default router;