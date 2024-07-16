import express,{Response, Request} from 'express';
import { getUserById,followUser,unfollowUser } from '../../controllers/user/user';
import  getUsersByCoinsOrder  from '../../controllers/leaderboard/leaderboard';
const userRouter = express.Router();

userRouter.get('/:id',getUserById);
userRouter.post('/follow',followUser);
userRouter.post('/unfollow',unfollowUser);
userRouter.get('/leaderboard/usersBycoins',getUsersByCoinsOrder);

export default userRouter