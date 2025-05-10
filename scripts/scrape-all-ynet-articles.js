// This script scrapes YNET articles from the WordPress website
// Run with: node scripts/scrape-all-ynet-articles.js

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
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

// Parse date from DD.MM.YYYY format to a Date object
function parseDate(dateStr) {
  if (!dateStr) return new Date();
  
  try {
    // Extract day, month, year
    const parts = dateStr.split('.');
    if (parts.length !== 3) {
      return new Date();
    }
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  } catch (error) {
    console.error('Date parsing error:', error);
    return new Date();
  }
}

// Scrape articles from the webpage
async function scrapeArticles() {
  try {
    console.log('Scraping YNET articles from the website...');
    
    // Replace with the actual URL of the website with YNET articles
    const url = 'https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/';
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const articles = [];
    
    // This selector pattern would need to be adjusted based on the actual HTML structure
    // This is a guess based on common WordPress structures
    $('h2:contains("YNET")').parent().find('article, .article, .post').each((index, element) => {
      const title = $(element).find('h2, h3, .article-title').text().trim();
      const dateText = $(element).find('.date, .post-date, time').text().trim();
      const link = $(element).find('a').attr('href');
      
      if (title && link) {
        const publishDate = parseDate(dateText);
        
        articles.push({
          title,
          publishDate,
          link,
          slug: createSlug(title),
          isPublished: true
        });
      }
    });
    
    console.log(`Found ${articles.length} articles on the page`);
    return articles;
  } catch (error) {
    console.error('Error scraping articles:', error);
    return [];
  }
}

// Save articles to database
async function saveArticlesToDatabase(articles) {
  try {
    const YnetArticle = mongoose.model('YnetArticle', YnetArticleSchema);
    let savedCount = 0;
    let existingCount = 0;
    
    for (const article of articles) {
      // Check if the article already exists (by title)
      const existing = await YnetArticle.findOne({ title: article.title });
      
      if (existing) {
        console.log(`Article already exists: "${article.title}"`);
        existingCount++;
        continue;
      }
      
      // Create new article
      await YnetArticle.create(article);
      console.log(`Saved article: "${article.title}"`);
      savedCount++;
    }
    
    console.log(`Saved ${savedCount} new articles. ${existingCount} articles already existed.`);
  } catch (error) {
    console.error('Error saving articles to database:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    await connectToDatabase();
    
    // Clear existing articles if needed
    // Uncomment the following lines to remove all existing articles
    // const YnetArticle = mongoose.model('YnetArticle', YnetArticleSchema);
    // await YnetArticle.deleteMany({});
    // console.log('Cleared existing articles');
    
    const articles = await scrapeArticles();
    
    if (articles.length > 0) {
      await saveArticlesToDatabase(articles);
    }
    
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