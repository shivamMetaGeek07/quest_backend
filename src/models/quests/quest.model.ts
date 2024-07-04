import mongoose, { Model, Schema } from "mongoose";

enum QuestType {
  MAIN = 'MAIN',
  SIDE = 'SIDE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

enum QuestStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

interface Reward {
  type: string;
  value: number;
}

export interface Quest {
  _id: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  rewards: Reward[];
}

const QuestSchema: Schema = new mongoose.Schema<Quest>({
 
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(QuestType),
    // required: true
  },
  status: {
    type: String,
    enum: Object.values(QuestStatus),
    // required: true
  },
  rewards: [{
    type: { type: String, required: true },
    value: { type: Number, required: true }
  }]
}, {
  timestamps: true
}); 

const QuestModel: Model<Quest> = mongoose.model<Quest>("Quest", QuestSchema);

export default QuestModel;