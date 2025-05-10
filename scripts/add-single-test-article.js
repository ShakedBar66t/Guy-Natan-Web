// This script adds a single test YNET article that matches the desired design
// Run with: node scripts/add-single-test-article.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/guy-natan';

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

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Function to add a single test article
async function addTestArticle() {
  try {
    // Create a test article that matches the design in the screenshot
    const article = {
      title: "חדשות הטכנולוגיה: פיתוחים חדשים בתחום הבינה המלאכותית",
      publishedAt: new Date("2025-05-10"),
      link: "https://www.ynet.co.il/technology/article/sample-article-2",
      slug: slugify("חדשות הטכנולוגיה פיתוחים חדשים בתחום הבינה המלאכותית", { lower: true, strict: true, locale: 'he' }) + '-' + Date.now(),
      isPublished: true
    };
    
    console.log('Adding test article to database:', article);
    const savedArticle = await YnetArticle.create(article);
    console.log('Article successfully added:', savedArticle);
  } catch (error) {
    console.error('Error adding test article:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the main function
async function main() {
  await connectToDatabase();
  await addTestArticle();
}

main(); 