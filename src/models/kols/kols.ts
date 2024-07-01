import mongoose, { Document, Schema } from 'mongoose';

// Define the interface based on the provided structure
export interface IKolsData extends Document {
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

// Define the schema
const KolsDataSchema: Schema = new Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  imageUrl: { type: String, required: true },
  upVotes: { type: Number, required: true },
  downVotes: { type: Number, required: true },
  socialLinks: {
    linkedin: { type: String, required: true },
    youtube: { type: String, required: true },
    facebook: { type: String, required: true },
    instagram: { type: String, required: true },
    twitter: { type: String, required: true },
  },
}, {
  timestamps: true // Add timestamps if you want to automatically manage `createdAt` and `updatedAt`
});

// Create the model
const KolsDB = mongoose.model<IKolsData>('KolsData', KolsDataSchema);

export default KolsDB;
