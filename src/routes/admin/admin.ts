import express from 'express';
import { login, signup } from '../../controllers/admin/adminControllers';
import { getCommunityData, createCommunityData, updateCommunityData } from '../../controllers/admin/communityData';
import { addFeed } from '../../controllers/feeds/feed';
const router = express.Router();

// Register admin
router.post('/signup',signup);
router.post('/login',login);
router.get('/getCommunityData',getCommunityData);
router.post('/createCommunityData',createCommunityData);
router.post('/updateCommunityData',updateCommunityData);
router.post('/add-feed',addFeed);


export default router;
