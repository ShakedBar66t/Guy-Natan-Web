// Script to scrape a single Guy Natan article from his WordPress site
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const { randomBytes } = require('crypto');

// Guy Natan's WordPress site URL
const GUY_NATAN_URL = 'https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/';

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

// Parse Hebrew date string to Date object
function parseHebrewDate(dateStr) {
  // Format is DD.MM.YYYY
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
}

// Scrape a single article from Guy Natan's WordPress site
async function scrapeSingleArticle() {
  try {
    console.log(`Scraping article from ${GUY_NATAN_URL}`);
    
    // Fetch the page content
    const response = await axios.get(GUY_NATAN_URL);
    const html = response.data;
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Find the first article heading
    const firstHeading = $('h2').first();
    const title = firstHeading.text().trim();
    
    if (!title || !title.match(/[\u0590-\u05FF]/)) {
      throw new Error('No valid Hebrew article title found');
    }
    
    // Find the date (which is typically in a time element)
    const dateElement = firstHeading.parent().find('time').first();
    let publishedAt = new Date();
    
    if (dateElement.length > 0) {
      const dateStr = dateElement.text().trim();
      if (dateStr.match(/\d{2}\.\d{2}\.\d{4}/)) {
        publishedAt = parseHebrewDate(dateStr);
      }
    }
    
    // Find the article URL if available
    let articleUrl = GUY_NATAN_URL;
    const linkElement = firstHeading.parent().find('a[href*="ynet"]').first();
    
    if (linkElement.length > 0) {
      const href = linkElement.attr('href');
      if (href && href.includes('ynet')) {
        articleUrl = href;
      }
    }
    
    const article = {
      title,
      publishedAt,
      link: articleUrl,
      slug: createSlug(title),
      isPublished: true
    };
    
    console.log('Found article:', article);
    return article;
  } catch (error) {
    console.error('Error scraping article:', error);
    throw error;
  }
}

// Add the scraped article to the database
async function addArticleToDatabase(article) {
  try {
    const YnetArticle = mongoose.models.YnetArticle || mongoose.model('YnetArticle', YnetArticleSchema);
    
    // Delete all existing articles first
    console.log('Deleting existing articles...');
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Add the new article
    console.log('Adding new article to the database...');
    const savedArticle = await YnetArticle.create(article);
    console.log('Successfully added article:', savedArticle.title);
    
    return savedArticle;
  } catch (error) {
    console.error('Error adding article to database:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('=== STARTING SINGLE ARTICLE SCRAPING PROCESS ===');
    await connectToDatabase();
    
    // Scrape a single article
    const article = await scrapeSingleArticle();
    
    // Add it to the database
    await addArticleToDatabase(article);
    
    console.log('=== ARTICLE SCRAPING COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
main(); 