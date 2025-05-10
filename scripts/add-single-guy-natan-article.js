// Script to add a single Guy Natan article
require('dotenv').config();
const mongoose = require('mongoose');
const { randomBytes } = require('crypto');

// Guy Natan's WordPress site URL
const GUY_NATAN_URL = 'https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/';

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

// Delete all existing YNET articles and add a single one
async function addSingleArticle() {
  try {
    const YnetArticle = mongoose.models.YnetArticle || mongoose.model('YnetArticle', YnetArticleSchema);
    
    // Delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Create a single article with data from Guy Natan's site
    const article = {
      title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
      publishedAt: new Date("2025-05-09"),
      link: GUY_NATAN_URL,
      slug: createSlug("גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון"),
      isPublished: true
    };
    
    // Add the article to the database
    const savedArticle = await YnetArticle.create(article);
    console.log('Added a single Guy Natan YNET article:', savedArticle);
    
    return savedArticle;
  } catch (error) {
    console.error('Error adding Guy Natan YNET article:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    await connectToDatabase();
    await addSingleArticle();
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