import { Request, Response } from 'express';
import Feed from '../../models/feed/feed';

export const addFeed = async (req: Request, res: Response) => {
    console.log(req.body);
    const { title, author, imageUrl, summary,description } = req.body;
    try {
        if (!title || !description || !imageUrl) {
            return res.status(400).json({ error: 'Title, description, and imageUrl are required' });
        }

        const newFeed = new Feed({ title, description, imageUrl, author, summary});
        const savedFeed = await newFeed.save();

        res.status(201).json({ success: true, feed: savedFeed });
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create feed', details: error.message });
    }
};

export const getFeeds = async (req: Request, res: Response) => {
    try {
        const feeds = await Feed.find();
        res.status(200).json({ success: true, feeds });
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ error: 'Unable to retrieve feeds', details: error.message });
    }
};

export const getFeedById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const feed = await Feed.findById(id);
        if (feed) {
            res.status(200).json({ success: true, feed });
        } else {
            res.status(404).json({ success: false, error: 'Feed not found' });
        }
    } catch (error:any) {
        console.error(error);
        res.status(500).json({ error: 'Unable to retrieve feed', details: error.message });
    }
};
