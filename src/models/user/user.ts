import mongoose, { Document, Model, Schema } from "mongoose";
import { Quest } from "../quests/quest.model";

// Define an interface for the TwitterInfo schema
interface ITwitterInfo {
  twitterId?: string;
  username?: string;
  profileImageUrl?: string;
}

interface IDiscordInfo {
  discordId?: string;
  username?: string;
  profileImageUrl?: string;
}

// Define an interface for the User schema
export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  image: string;
  rank:string;
  quest:Quest[];
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
    twitterInfo: {
      twitterId: { type: String },
      username: { type: String },
      profileImageUrl: { type: String },
    },
    discordInfo: {
      discordId: { type: String },
      username: { type: String },
      profileImageUrl: { type: String },
    },
    Quest: [{ type: Schema.Types.ObjectId, ref: "Quest" }],
  },
  { timestamps: true }
);

// Create the User model
const UserDb: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserDb;
