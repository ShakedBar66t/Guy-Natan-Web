import mongoose from 'mongoose';

export interface IYnetArticle {
  title: string;
  content?: string;
  excerpt?: string;
  date: string;
  slug: string;
  isPublished: boolean;
  externalLink?: string;
  originalLink?: string;
}

// Only define the schema if it doesn't already exist
const YnetArticleSchema = new mongoose.Schema<IYnetArticle>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this YNET article'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    excerpt: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Please provide a date for this YNET article'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug for this YNET article'],
      unique: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    externalLink: {
      type: String,
      default: '',
    },
    originalLink: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Safe model loading with error handling
function getModel() {
  try {
    // Check if the model already exists to prevent overwriting it
    if (mongoose.models.YnetArticle) {
      return mongoose.models.YnetArticle;
    }
    
    // If it doesn't exist yet, create it
    return mongoose.model<IYnetArticle>('YnetArticle', YnetArticleSchema);
  } catch (error) {
    console.error('Error creating YnetArticle model:', error);
    
    // Fallback to existing model if there's an error
    if (mongoose.models.YnetArticle) {
      return mongoose.models.YnetArticle;
    }
    
    throw error;
  }
}

// Export the model using the safe getter function
export default getModel(); 