import mongoose, { Schema, Document, Model } from 'mongoose';

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

 export interface IReferral extends Document {
  referralCode:string;
  userInfo: string; 
  questInfo: string;
  communityInfo:string;
  taskInfo: string;
  expiresAt: Date; 
} 
const ReferralSchema:Schema=new mongoose.Schema({
  referralCode:{type:String ,unique:true,required:true},
  userInfo:{type:String,required:true},
  questInfo:{type:String,required:true},
  communityInfo:{type:String,required:true},
  taskInfo:{type:String,required:true},
  expiresAt: { type: Date, required: true, index: { expires: '0s' } } 
},{timestamps:true});
const ReferralDb:Model<IReferral>= mongoose.model<IReferral>("Referral",ReferralSchema);
export {ReferralDb ,Badge} ;