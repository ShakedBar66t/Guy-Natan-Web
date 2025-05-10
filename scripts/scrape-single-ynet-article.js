// This script scrapes a single YNET article from the WordPress site and adds it to MongoDB
// Run with: node scripts/scrape-single-ynet-article.js

const axios = require('axios');
const cheerio = require('cheerio');
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

// Function to parse a Hebrew date (DD.MM.YYYY) into a Date object
function parseHebrewDate(dateStr) {
  // Format: DD.MM.YYYY
  const parts = dateStr.split('.');
  if (parts.length !== 3) {
    return new Date(); // Return current date if format is invalid
  }
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
  const year = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
}

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

// Function to delete all existing articles
async function deleteAllArticles() {
  try {
    console.log('Deleting all existing YNET articles...');
    const result = await YnetArticle.deleteMany({});
    console.log(`Deleted ${result.deletedCount} articles`);
  } catch (error) {
    console.error('Error deleting articles:', error);
  }
}

// Function to scrape a single article from the WordPress site
async function scrapeSingleArticle(articleNumber = 1) {
  try {
    console.log('Scraping WordPress site for a YNET article...');
    
    // URL of the YNET articles page
    const url = 'https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/';
    
    // Fetch the HTML content
    const response = await axios.get(url);
    const html = response.data;
    
    // Load HTML into cheerio
    const $ = cheerio.load(html);
    
    // Find headings (titles) that aren't the page title
    const headings = $('h2, h3').filter(function() {
      const text = $(this).text().trim();
      return text && !text.includes('הטור של גיא נתן');
    });
    
    if (headings.length === 0) {
      console.log('No articles found');
      return null;
    }
    
    // Get the specified article number (1-based index)
    const index = Math.min(articleNumber - 1, headings.length - 1);
    const heading = $(headings[index]);
    
    // Extract the article data
    const title = heading.text().trim();
    const dateText = heading.next().text().trim();
    const readMoreElement = heading.next().next();
    const link = readMoreElement.is('a') ? readMoreElement.attr('href') : readMoreElement.find('a').attr('href');
    
    if (!title || !dateText || !link) {
      console.log('Missing required data for article');
      return null;
    }
    
    const publishedAt = parseHebrewDate(dateText);
    
    const article = {
      title,
      publishedAt,
      link,
      slug: slugify(title, { lower: true, strict: true, locale: 'he' }) + '-' + Date.now(),
      isPublished: true
    };
    
    console.log('Found article:', article);
    return article;
  } catch (error) {
    console.error('Error scraping article:', error);
    return null;
  }
}

// Function to add an article to the database
async function addArticleToDatabase(article) {
  try {
    if (!article) {
      console.log('No article to add');
      return;
    }
    
    console.log('Adding article to database...');
    const createdArticle = await YnetArticle.create(article);
    console.log('Article added successfully:', createdArticle);
  } catch (error) {
    console.error('Error adding article to database:', error);
  }
}

// Main function
async function main() {
  try {
    // Get article number from command line arguments
    const args = process.argv.slice(2);
    const articleNumber = args.length > 0 ? parseInt(args[0], 10) : 1;
    
    // Connect to the database
    await connectToDatabase();
    
    // Delete all existing articles
    await deleteAllArticles();
    
    // Scrape a single article
    const article = await scrapeSingleArticle(articleNumber);
    
    // Add the article to the database
    await addArticleToDatabase(article);
    
    console.log('Script completed successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main(); 