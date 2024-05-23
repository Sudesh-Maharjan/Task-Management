import { Router} from 'express';
import {sendOtp, register, login } from './controller';
const router = Router();

router.post('/send-otp', sendOtp);
router.post('/register', register);
router.post('/login', login);

export default router;