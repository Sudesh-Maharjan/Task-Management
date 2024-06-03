import {Router} from 'express';
import {createTask, getTasks, getTask, updateTask, deleteTask} from './controller';
import { auth } from '../../../Middleware/auth';
import { checkTaskOwnership } from '../../../Middleware/Authorization';

const router = Router();

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/:id',auth,checkTaskOwnership, getTask);
router.put('/:id', auth, checkTaskOwnership, updateTask);
router.delete('/:id', auth,checkTaskOwnership, deleteTask);

export default router;