import mongoose, { Schema, models } from 'mongoose';

export interface FAQ {
  question: string;
  answer: string;
  isPublished: boolean;
  order: number;
}

const FAQSchema = new Schema<FAQ>(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Create model if it doesn't exist yet
const FAQModel = models.FAQ || mongoose.model('FAQ', FAQSchema);

export default FAQModel; 