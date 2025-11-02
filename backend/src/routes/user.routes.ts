import { Router } from 'express';
import { 
	createUser, 
	signIn
} from '../controllers/user.controller';

const router = Router();

// Authentication routes
router.post('/signup', createUser);
router.post('/signin', signIn);

export default router;