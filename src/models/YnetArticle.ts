import mongoose, { Schema, Document } from 'mongoose';

export interface IYnetArticle extends Document {
  title: string;
  publishedAt: Date;
  link: string;
  slug: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const YnetArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    publishedAt: {
      type: Date,
      required: [true, 'Please provide a publish date'],
    },
    link: {
      type: String,
      required: [true, 'Please provide an article link'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
const YnetArticle = mongoose.models.YnetArticle || mongoose.model<IYnetArticle>('YnetArticle', YnetArticleSchema);

export default YnetArticle; 