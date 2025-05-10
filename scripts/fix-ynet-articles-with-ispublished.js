// This script updates all YNET articles to set isPublished=true
// Run with: node scripts/fix-ynet-articles-with-ispublished.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection URI (update with your actual URI)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guy-natan';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Define the YnetArticle schema
const YnetArticleSchema = new mongoose.Schema(
  {
    title: String,
    publishedAt: Date,
    link: String,
    slug: String,
    isPublished: Boolean,
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: 'ynetarticles' }
);

// Create or retrieve the model
const YnetArticle = mongoose.models.YnetArticle || mongoose.model('YnetArticle', YnetArticleSchema);

// Function to update all YNET articles
async function updateAllArticles() {
  try {
    // Find articles without isPublished field
    const articlesBeforeUpdate = await YnetArticle.find({}).lean();
    console.log(`Found ${articlesBeforeUpdate.length} total YNET articles before update`);
    
    // Update all articles to set isPublished=true
    const updateResult = await YnetArticle.updateMany(
      {}, // match all documents
      { $set: { isPublished: true } },
      { upsert: false }
    );
    
    console.log('Update result:', updateResult);
    console.log(`Updated ${updateResult.modifiedCount} YNET articles`);
    
    // Verify articles after update
    const articlesAfterUpdate = await YnetArticle.find({ isPublished: true }).lean();
    console.log(`Found ${articlesAfterUpdate.length} published YNET articles after update`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating YNET articles:', error);
  }
}

// Run the function
async function main() {
  await connectToDatabase();
  await updateAllArticles();
}

main(); 