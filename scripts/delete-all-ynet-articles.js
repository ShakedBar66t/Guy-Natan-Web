// Script to delete all Ynet articles from the database
require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection URI with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/guy-natan';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    console.log(`Connecting to MongoDB database...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define YnetArticle model schema
const YnetArticleSchema = new mongoose.Schema(
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

// Delete all existing YNET articles
async function deleteAllYnetArticles() {
  try {
    console.log('Finding and deleting all YNET articles from the database...');
    const YnetArticle = mongoose.models.YnetArticle || mongoose.model('YnetArticle', YnetArticleSchema);
    
    // Delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Successfully deleted ${deleteResult.deletedCount} YNET articles from the database`);
    
    return deleteResult;
  } catch (error) {
    console.error('Error deleting YNET articles:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('=== STARTING YNET ARTICLES DELETION PROCESS ===');
    await connectToDatabase();
    await deleteAllYnetArticles();
    console.log('=== ALL YNET ARTICLES HAVE BEEN DELETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
main(); 