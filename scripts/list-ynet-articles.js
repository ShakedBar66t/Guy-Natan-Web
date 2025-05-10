// This script lists all YNET articles in the database
// Run with: node scripts/list-ynet-articles.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection URI
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

// Function to list all YNET articles
async function listAllArticles() {
  try {
    // Find all articles
    const articles = await YnetArticle.find({}).lean();
    
    console.log(`Found ${articles.length} total YNET articles in the database:`);
    
    // Print each article
    articles.forEach((article, index) => {
      console.log(`\n--- Article ${index + 1} ---`);
      console.log('ID:', article._id);
      console.log('Title:', article.title);
      console.log('Published At:', article.publishedAt);
      console.log('Link:', article.link);
      console.log('Slug:', article.slug);
      console.log('Is Published:', article.isPublished);
      console.log('Created At:', article.createdAt);
      console.log('Updated At:', article.updatedAt);
    });

    // Find published articles
    const publishedArticles = await YnetArticle.find({ isPublished: true }).lean();
    console.log(`\nFound ${publishedArticles.length} published YNET articles.`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error listing YNET articles:', error);
  }
}

// Run the function
async function main() {
  await connectToDatabase();
  await listAllArticles();
}

main(); 