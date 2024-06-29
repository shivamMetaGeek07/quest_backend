import { Request, Response } from 'express';

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

export const getAllKols = (req: Request, res: Response): void => {
  res.send({status:200,data:KolsData});
};

export const getKolById = (req: Request, res: Response): void => {
  const { id } = req.params;
  res.send(`Get KOL with ID: ${id}`);
};

export const createKol = (req: Request, res: Response): void => {
  res.send('Create a new KOL');
};