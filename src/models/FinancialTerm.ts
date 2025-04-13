import mongoose, { Schema, Document } from 'mongoose';

export interface IFinancialTerm extends Document {
  term: string;
  definition: string;
  slug: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  order?: number; // For controlling display order
}

const FinancialTermSchema: Schema = new Schema(
  {
    term: {
      type: String,
      required: [true, 'Please provide a term name'],
      maxlength: [100, 'Term cannot be more than 100 characters'],
    },
    definition: {
      type: String,
      required: [true, 'Please provide a definition for this term'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug for this term'],
      unique: true,
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
export default mongoose.models.FinancialTerm || mongoose.model<IFinancialTerm>('FinancialTerm', FinancialTermSchema); 