import { Router } from 'express';
import { addFeed, getFeeds, getFeedById } from '../controllers/feeds/feed';

const router = Router();

router.post('/feeds', addFeed);
router.get('/feeds', getFeeds);
router.get('/feeds/:id', getFeedById);

export default router;
