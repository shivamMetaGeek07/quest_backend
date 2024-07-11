import mongoose, { Document, Model, Schema } from 'mongoose';

// Base interface for all task types
interface ITaskBase extends Document {
  category: 'Actions' | 'Answers' | 'Social' | 'On-chain action';
  // type: 'visit' | 'poll' | 'quiz' | 'invite' | 'upload';
  type: string;
  questId: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  completions: Array<{
    user: mongoose.Types.ObjectId;
    completedAt: Date;
    submission?: string;
    userName?: string;
  }>;
} 

interface IQuiz {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface IPoll {
  question: string;
  options: string[];
}

// Combined type for all task types
export type TaskOrPoll = ITaskBase & {
  _id: string;
  visitLink?: string;
  visitor?: mongoose.Types.ObjectId[];
  quizzes?: IQuiz[];
  polls?: IPoll[];
  correctAnswer?: string;
  inviteLink?: string;
  invitee?: mongoose.Types.ObjectId[];
  uploadLink?: string;
  response?: string | number;
  taskName?: string;
  taskDescription: string;
};


const TaskSchema: Schema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Actions', 'Answers', 'Social', 'On-chain action']
    },
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
      ref: 'Quest'
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Kol' 
    },
    taskName: {
      type: String,
    },
    taskDescription: {
      type: String,
    },
    
    
    // Optional fields based on task type
    visitLink: { type: String },
    visitor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    quizzes: [{
      question: { type: String },
      options: [{ type: String }],
      correctAnswer: { type: String }
    }],
    polls: [{
      question: { type: String },
      options: [{ type: String }]
    }],
    inviteLink: { type: String },
    invitee: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    uploadLink: { type: String },
    response: { type: mongoose.Schema.Types.Mixed },

    completions: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      completedAt: { type: Date, default: Date.now },
      submission: { type: String },
      userName : {type : String}
    }]
  },
  { timestamps: true }
);

// Create the model
const TaskModel: Model<TaskOrPoll> = mongoose.model<TaskOrPoll>('Task', TaskSchema);

export default TaskModel;