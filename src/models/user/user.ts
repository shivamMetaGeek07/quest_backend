import mongoose, { Document, Model, Schema } from "mongoose";

// Define interfaces for the sub-schemas
export interface ITwitterInfo {
  twitterId?: string;
  username?: string;
  profileImageUrl?: string;
  oauthToken?: string;
  oauthTokenSecret?: string;
}

export interface ITeleInfo {
  telegramId?: string;
  teleName?: string;
  teleusername?: string; 
}

export interface IDiscordInfo {
  discordId?: string;
  username?: string;
  profileImageUrl?: string;
  accessToken: string;
  refreshToken: string;
  guilds?: string[];
}

// Define an interface for the User schema
export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  bio: string;
  nickname: string;
  bgImage: string;
  badges?: string[];
  role: string;
  image: string;
  rank: number;
  level: string;
  quest: mongoose.Types.ObjectId[];
  community: mongoose.Types.ObjectId[];
  rewards: {
    xp: number;
    coins: number;
  };
  completedTasks: mongoose.Types.ObjectId[];
  twitterInfo?: ITwitterInfo;
  discordInfo?: IDiscordInfo;
  teleInfo?: ITeleInfo;
  followers: string[];
  following: string[];
  createdCommunities: mongoose.Types.ObjectId[];
  createdQuests: mongoose.Types.ObjectId[];
  createdTasks: mongoose.Types.ObjectId[];
  
}

// Create the User schema
const userSchema: Schema = new mongoose.Schema(
  {
    googleId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String },
    bgImage: { type: String },
    nickname: { type: String },
    badges: { type: [String] },
    role: { type: String, default: 'user' },
    level: { type: String, default: 'NOOB' },
    rank: { type: Number, default: 0 },
    quest: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quest" }],
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    community: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
    rewards: {
      xp: { type: Number, default: 0 },
      coins: { type: Number, default: 0 },
    },
    twitterInfo: {
      twitterId: { type: String },
      username: { type: String },
      profileImageUrl: { type: String },
      oauthToken: { type: String },
      oauthTokenSecret: { type: String },
    },
    discordInfo: {
      discordId: { type: String },
      username: { type: String },
      profileImageUrl: { type: String },
      accessToken: { type: String },
      refreshToken: { type: String },
      guilds: { type: [String] },
    },
    teleInfo: {
      telegramId: { type: String },
      teleName: { type: String },
      teleusername: { type: String },
    },
    followers: [{ type: String, default: [] }],
    following: [ { type: String, default: [] } ],
    
    createdTasks: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Task' } ],
    createdQuests: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' } ],
    createdCommunities: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  },
  { timestamps: true }
);

// Create the User model
const UserDb: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserDb;
