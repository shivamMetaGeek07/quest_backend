import { NextFunction, Request, Response } from 'express';
import KolsDB from '../../models/kols/kols';
import UserDb, { IUser } from '../../models/user/user';

interface KolsData {
  name: string;
  userName: string;
  role: string;
  bio: string;
  imageUrl: string;
  upVotes: number;
  downVotes: number;
  socialLinks: {
    linkedin: string;
    youtube: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
}
const KolsData: KolsData[] = [
  {
    name: 'John Doe',
    userName: 'john_doe',
    role: 'Software Developer',
    bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
    imageUrl: 'https://randomuser.me/api/portraits/men/94.jpg',
    upVotes: 100,
    downVotes: 20,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'Jane Smith',
    userName: 'jane_smith',
    role: 'UI/UX Designer',
    bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco...',
    imageUrl: 'https://randomuser.me/api/portraits/women/81.jpg',
    upVotes: 85,
    downVotes: 15,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'Michael Johnson',
    userName: 'michael_johnson',
    role: 'Data Scientist',
    bio: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    imageUrl: 'https://randomuser.me/api/portraits/men/65.jpg',
    upVotes: 120,
    downVotes: 10,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'Emily Brown',
    userName: 'emily_brown',
    role: 'Product Manager',
    bio: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui...',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    upVotes: 95,
    downVotes: 25,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'David Wilson',
    userName: 'david_wilson',
    role: 'Full Stack Developer',
    bio: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum...',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    upVotes: 80,
    downVotes: 30,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'John Doe',
    userName: 'john_doe',
    role: 'Software Developer',
    bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
    imageUrl: 'https://randomuser.me/api/portraits/men/94.jpg',
    upVotes: 100,
    downVotes: 20,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'Jane Smith',
    userName: 'jane_smith',
    role: 'UI/UX Designer',
    bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco...',
    imageUrl: 'https://randomuser.me/api/portraits/women/81.jpg',
    upVotes: 85,
    downVotes: 15,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'Michael Johnson',
    userName: 'michael_johnson',
    role: 'Data Scientist',
    bio: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    imageUrl: 'https://randomuser.me/api/portraits/men/65.jpg',
    upVotes: 120,
    downVotes: 10,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'Emily Brown',
    userName: 'emily_brown',
    role: 'Product Manager',
    bio: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui...',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    upVotes: 95,
    downVotes: 25,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
  {
    name: 'David Wilson',
    userName: 'david_wilson',
    role: 'Full Stack Developer',
    bio: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum...',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    upVotes: 80,
    downVotes: 30,
    socialLinks: {
      linkedin: 'https://linkedin.com/yourprofile',
      youtube: 'https://youtube.com/yourchannel',
      facebook: 'https://facebook.com/yourprofile',
      instagram: 'https://instagram.com/yourprofile',
      twitter: 'https://twitter.com/yourhandle',
    },
  },
];

export const createKols = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user =await req.body
    console.log("Request Body:", user);
    // Check if `kolsData` exists in request body
    if (!req.body.kolsData) {
      return res.status(400).json({ error: "Bad Request", message: "No KolsData provided" });
    }

    const { name, userName, role, bio, imageUrl, upVotes, downVotes, socialLinks } = req.body.kolsData;

    if (!name || !userName || !role) {
      return res.status(400).json({ error: "Bad Request", message: "Missing required KolsData fields" });
    }

    // Check if a KolsData document with the same name, userName, and role already exists
    const existingKolsData = await KolsDB.findOne({
      name: name,
      userName: userName,
      role: role,
    });

    if (existingKolsData) {
      return res.status(409).json({
        error: "Conflict",
        message: "KolsData with the same name, userName, and role already exists",
      });
    }

    // Create and save the new KolsData document
    const newKolsData = new KolsDB({
      name,
      userName,
      role,
      bio,
      imageUrl,
      upVotes,
      downVotes,
      socialLinks,
    });

    await newKolsData.save();
    console.log("KolsData saved:", newKolsData);

    // Respond with the newly created KolsData document
    return res.status(200).json({
      success: true,
      message: "KolsData added successfully",
      kolsData: newKolsData,
    });
  } catch (error) {
    console.error("Error in createKols:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllKol = async (req: Request, res: Response) => {
  try {
    // Fetch all KolsData documents from the database
    const kols = await KolsDB.find();

    // Respond with the fetched data
    return res.status(200).json({
      success: true,
      message: 'Fetched all KolsData documents successfully',
      kols,
    });
  } catch (error) {
    console.error('Error fetching KolsData:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error fetching KolsData',
    });
  }
};

export const createKol = (req: Request, res: Response): void => {
  res.send('Create a new KOL');
};