import {Router} from 'express';
import { loginUser, logoutUser, registerUser, verifyOTP } from '../controllers/auth.controller.js';
import authorize from '../middleware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/verifyOTP', verifyOTP)
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);

export default authRouter;