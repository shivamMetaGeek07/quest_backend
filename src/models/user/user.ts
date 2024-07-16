import mongoose, { Document, Model, Schema } from "mongoose";
import { Quest } from "../quest/quest.model";
import { TaskOrPoll } from "../task/task.model";

// Define an interface for the TwitterInfo schema
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
  bio:string;
  nickname:string;
  bgImage:string;
  badjes?: string[];
  role: string;
  image: string;
  rank: string;
  quest: string[];
  tasks: string[];
  community: string[];
  rewards: {
    xp: number;
    coins: number;
  };
  completedTasks: string[];
  twitterInfo?: ITwitterInfo;
  discordInfo?: IDiscordInfo;
  teleInfo?:ITeleInfo;
}
 
// Create the User schema
const userSchema: Schema = new mongoose.Schema(
  {
    googleId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    bio:  {type:String},
    bgImage:{type:String},
    nickname:  {type:String},
    badges:{type:[String]},
    role: { type: String, default: 'user' },
    rank: { type: String, default: 'beginner' },
    quest: [ { type: Schema.Types.ObjectId, ref: "Quest" } ],
    tasks: [ { type: Schema.Types.ObjectId, ref: "TaskOrPoll" } ],
    completedTasks: [ { type: mongoose.Schema.Types.ObjectId, ref: 'TaskOrPoll' } ],
    community: [ { type: Schema.Types.ObjectId, ref: "Community" } ],
    rewards: {
      xp: { type: Number, default: 0 },
      coins: { type: Number, default: 0 }
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
  }, 
  { timestamps: true }
);

// Create the User model
const UserDb: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserDb;
