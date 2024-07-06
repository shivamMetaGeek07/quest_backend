import { Router } from 'express';
import { addFeed, getFeeds, getFeedById, updateFeed, deleteFeed } from '../controllers/feeds/feed';

const feedRouter = Router();

feedRouter.post('/', addFeed);
feedRouter.get('/', getFeeds);
feedRouter.get( '/:id', getFeedById );

// update feed
// feedRouter.patch( '/:id', updateFeed );

// // delete feed
// feedRouter.delete( '/:id', deleteFeed );


export default feedRouter;
