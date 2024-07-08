import mongoose, { Schema, Document } from 'mongoose';

// models/Badge
export interface IBadge extends Document {
  name: string;
  level: number;
  imageUrl: string;
  questCriteria: number;
  taskCriteria: number; 
}

const BadgeSchema: Schema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  questCriteria: { type: Number, required: true }, 
  taskCriteria: { type: Number, required: true },
});

const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);

export { Badge };
