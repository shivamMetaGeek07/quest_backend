import express from 'express';
import {   createKols, getAllKol } from '../../controllers/kols/kols';
import { isAuthenticated } from '../../middleware/user/authorize.user';

const kolsRouter = express.Router();

kolsRouter.get('/get',isAuthenticated, getAllKol);
kolsRouter.post('/create',createKols);


export default kolsRouter;