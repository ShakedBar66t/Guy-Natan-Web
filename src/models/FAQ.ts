import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Please provide a question'],
      maxlength: [300, 'Question cannot be more than 300 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Please provide an answer for this question'],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema); 