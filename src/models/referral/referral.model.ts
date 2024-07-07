import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referralCode: string;
  userId: string;
  taskId: string;
}

const ReferralSchema: Schema = new Schema({
  referralCode: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  taskId: { type: String, required: true },
});

const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);

export default Referral;
