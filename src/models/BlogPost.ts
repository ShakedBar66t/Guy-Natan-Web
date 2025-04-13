import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  level?: string;
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
    slug: {
      type: String,
      required: [true, 'Please provide a slug for this blog post.'],
      unique: true,
    },
    excerpt: {
      type: String,
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
    category: {
      type: String,
    },
    level: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema); 