import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  preview?: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  scheduledPublishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  level?: string;
  relatedTerms?: string[]; // Array of term IDs
  author?: string;
}

const BlogPostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this blog post.'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content for this blog post.'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    preview: {
      type: String,
      maxlength: [500, 'Preview cannot be more than 500 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug for this blog post.'],
      unique: true,
    },
    coverImage: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    scheduledPublishDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      enum: ['פיננסים', 'השקעות', 'כלכלה', 'כלכלה אישית', 'כללי'],
      default: 'כללי',
    },
    level: {
      type: String,
    },
    relatedTerms: {
      type: [{ type: Schema.Types.ObjectId, ref: 'FinancialTerm' }],
      default: [],
    },
    author: {
      type: String,
      default: 'גיא נתן',
    }
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema); 