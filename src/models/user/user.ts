import mongoose, { Document, Model, Schema } from "mongoose";
import { Quest } from "../quests/quest.model";

// Define an interface for the TwitterInfo schema
export interface ITwitterInfo {
  twitterId?: string;
  username?: string;
  profileImageUrl?: string;
  oauthToken?: string;
  oauthTokenSecret?: string;
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
  role: string;
  image: string;
  rank: string;
  quest: Quest[];
  twitterInfo?: ITwitterInfo;
  discordInfo?: IDiscordInfo;
}

// Create the User schema
const userSchema: Schema = new mongoose.Schema(
  {
    googleId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, default: 'user' },
    rank: { type: String, default: 'beginner' },
    quest: [{ type: Schema.Types.ObjectId, ref: "Quest" }],
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
  },
  { timestamps: true }
);

// Create the User model
const UserDb: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserDb;
