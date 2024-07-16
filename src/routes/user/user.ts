import express,{Response, Request} from 'express';
import { getUserById,followUser,unfollowUser, getAllUser } from '../../controllers/User/user.js';
import  getUsersByCoinsOrder  from '../../controllers/leaderboard/leaderboard';
const userRouter = express.Router();

userRouter.get('/:id',getUserById);
userRouter.post('/follow',followUser);
userRouter.post('/unfollow',unfollowUser);
userRouter.get('/leaderboard/usersBycoins',getUsersByCoinsOrder);
userRouter.get('/getAllUser',getAllUser)

export default userRouter