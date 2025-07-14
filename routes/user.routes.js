import {Router} from 'express';
import authorize from '../middleware/auth.middleware.js';
import {getUsers, getUser} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', authorize, getUsers);
userRouter.get('/:id', authorize, getUser)

export default userRouter;