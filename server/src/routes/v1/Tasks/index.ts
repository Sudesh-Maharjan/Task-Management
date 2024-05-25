import {Router} from 'express';
import {createTask, getTasks, getTask, updateTask, deleteTask} from './controller';
import { auth } from '../../../Middleware/auth';

const router = Router();

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/:id',auth, getTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

export default router;