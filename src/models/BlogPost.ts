import mongoose from 'mongoose';

export interface IBlogPost {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  level: string;
  slug: string;
  isPublished: boolean;
  featuredImage?: string;
}

const BlogPostSchema = new mongoose.Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this blog post'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt for this blog post'],
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content for this blog post'],
    },
    date: {
      type: String,
      default: () => new Date().toISOString(),
    },
    category: {
      type: String,
      required: [true, 'Please provide a category for this blog post'],
      enum: ['השקעות', 'חיסכון', 'פנסיה', 'משכנתאות', 'מיסוי', 'כלכלה'],
    },
    level: {
      type: String,
      required: [true, 'Please provide a level for this blog post'],
      enum: ['מתחילים', 'מתקדמים', 'מומחים'],
    },
    slug: {
      type: String,
      unique: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    featuredImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug if not provided
BlogPostSchema.pre('save', function(next) {
  if (!this.slug) {
    // Generate slug from title (simplified version)
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')     // Replace multiple - with single -
      .replace(/^-+/, '')         // Trim - from start of text
      .replace(/-+$/, '');        // Trim - from end of text
  }
  
  if (!this.date) {
    this.date = new Date().toISOString();
  }
  
  next();
});

// Create or retrieve the model
export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema); 