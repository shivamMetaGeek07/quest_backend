import mongoose, { Schema, Document, Model } from 'mongoose';


interface IFeed extends Document {
    title: string;
    description: string;
    imageUrl: string;
}


const FeedSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

// Create a Model.
const Feed: Model<IFeed> = mongoose.model<IFeed>('Feed', FeedSchema);

export default Feed;
