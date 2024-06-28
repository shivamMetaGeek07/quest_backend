import mongoose, { Document, Model, Schema } from "mongoose";

// Define an interface for the User schema
export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  image: string;
}

// Create the User schema
const userSchema: Schema = new mongoose.Schema(
  {
    googleId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

// Create the User model
const UserDb: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserDb;
