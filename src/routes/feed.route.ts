import { Router } from 'express';
import { addFeed, getFeeds, getFeedById } from '../controllers/feeds/feed';

const feedRouter = Router();

feedRouter.post('/', addFeed);
feedRouter.get('/', getFeeds);
feedRouter.get('/:id', getFeedById);

export default feedRouter;
