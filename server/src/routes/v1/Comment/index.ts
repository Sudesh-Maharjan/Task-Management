import { Router } from 'express';
import { addComment, updateComment, deleteComment, getComments } from './controller';
import {auth} from '../../../Middleware/auth';

const router = Router();

router.post('/:taskId/comments', auth, addComment);
router.get('/:taskId/comments', auth, getComments);
router.put('/:taskId/comments/commentId', auth, updateComment);
router.delete('/:taskId/comments/commentId', auth, deleteComment);

export default router;