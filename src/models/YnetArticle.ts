import mongoose, { Schema, Document } from 'mongoose';

export interface IYnetArticle extends Document {
  title: string;
  link: string;
  slug: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const YnetArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this Ynet article.'],
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    link: {
      type: String,
      required: [true, 'Please provide a link to the Ynet article.'],
    },
    slug: {
      type: String,
      required: [true, 'A slug is required for this Ynet article.'],
      unique: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.YnetArticle || mongoose.model<IYnetArticle>('YnetArticle', YnetArticleSchema); 