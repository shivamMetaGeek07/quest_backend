import mongoose, { Document, Model, Schema } from 'mongoose';

// Common interface for both Task and Poll
interface ITaskBase extends Document {
  _id: string;
  category: 'Actions' | 'Answers' | 'Social' | 'On-chain action';
  creator: string;
}

// Interface for visit
export interface IVisite extends ITaskBase {
  visitLink: string;
}

// Interface for Poll
export interface IPoll extends ITaskBase {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Interface for quiz
export interface IQuiz extends ITaskBase {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Interface for invite
export interface IInvite extends ITaskBase {
  inviteLink: string;
  invitee?: string[];
}

// Combined type
export type TaskOrPoll = IVisite | IPoll | IQuiz | IInvite;

// Schema for the combined Task and Poll
const TaskSchema: Schema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Actions', 'Answers', 'Social', 'On-chain action']
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
        },
    
        // Task-specific fields
        visitLink: { type: String },
    
    // Poll and Quiz-specific fields
    question: { type: String },
    options: [{ type: String }],
        correctAnswer: { type: String },
    
    // Invite-specific fields
    inviteLink: { type: String },
        invitee: [ { type: String } ]
    
  },
  { timestamps: true }
);

// Create the model
const TaskModel: Model<TaskOrPoll> = mongoose.model<TaskOrPoll>('Task', TaskSchema);

export default TaskModel;
