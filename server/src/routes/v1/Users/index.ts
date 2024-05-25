import { Router} from 'express';
import {sendOtp, register, login } from './controller';
const router = Router();
import refreshTokenRoute from '../Auth/index'

router.post('/send-otp', sendOtp);
router.post('/register', register);
router.post('/login', login);
router.use(refreshTokenRoute);

export default router;