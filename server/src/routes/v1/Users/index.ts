import { Router} from 'express';
import { sendOtp, register, login, getAllUsers, getUserById, getColorPreferences, saveColorPreferences } from './controller';
const router = Router();
import refreshTokenRoute from '../Auth/index'
import { auth } from '../../../Middleware/auth';

router.post('/send-otp', sendOtp);
router.post('/register', register)
router.post('/login', login);
router.get('/allusers', getAllUsers);
// router.get('/:_id', getUser);
router.get('/allusers/:assigneeID', getUserById);
router.get('/user/settings',auth, getColorPreferences);
router.post('/user/settings',auth, saveColorPreferences);
router.use(refreshTokenRoute);

export default router;