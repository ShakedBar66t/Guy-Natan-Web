// This script is used to scrape a single YNET article and save it to the database
// Run with: node scripts/scrape-ynet-article.js

require('dotenv').config();
const mongoose = require('mongoose');
const { randomBytes } = require('crypto');

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
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
    publishDate: {
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

// Generate a unique slug from title
function createSlug(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\sא-ת]/g, '')
    .replace(/\s+/g, '-')
    .trim();
  
  // Add random string to ensure uniqueness
  const randomStr = randomBytes(4).toString('hex');
  return `${slug}-${randomStr}`;
}

// Create a sample YNET article
async function createSampleArticle() {
  // Sample article data
  const sampleArticle = {
    title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
    publishDate: new Date("2025-05-09"),
    link: "https://www.ynet.co.il/economy/article/sample-article-1",
    slug: createSlug("גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון"),
    isPublished: true
  };

  try {
    const YnetArticle = mongoose.model('YnetArticle', YnetArticleSchema);
    
    // Check if the article already exists
    const existingArticle = await YnetArticle.findOne({ 
      title: sampleArticle.title
    });
    
    if (existingArticle) {
      console.log('Article already exists:', existingArticle);
      return existingArticle;
    }
    
    // Create the article
    const article = await YnetArticle.create(sampleArticle);
    console.log('Sample article created successfully:', article);
    return article;
  } catch (error) {
    console.error('Error creating sample article:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    await connectToDatabase();
    await createSampleArticle();
    console.log('Script completed successfully');
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
main(); 