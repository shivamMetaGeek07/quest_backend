import { Schema, model, Document } from 'mongoose';

interface ICommunity extends Document {
  categories: string[];
  ecosystems: string[];
}

const communitySchema = new Schema<ICommunity>({
  categories: { type: [String], required: true },
  ecosystems: { type: [String], required: true },
});

const CommunityData = model<ICommunity>('CommunityData', communitySchema);

export default CommunityData;
