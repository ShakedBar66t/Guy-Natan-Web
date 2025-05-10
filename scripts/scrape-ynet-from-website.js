// This script scrapes YNET articles from the Guy Natan WordPress site
// and adds them to our MongoDB database
// Run with: node scripts/scrape-ynet-from-website.js

const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guy-natan';

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

// Function to scrape YNET articles from the website
async function scrapeYnetArticles() {
  try {
    console.log('Scraping YNET articles from the WordPress site...');
    
    // URL of the YNET articles page
    const url = 'https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/';
    
    // Fetch the HTML content
    const response = await axios.get(url);
    const html = response.data;
    
    // Load HTML into cheerio
    const $ = cheerio.load(html);
    
    // Initialize articles array
    const articles = [];
    
    // Extract all article blocks - each contains title, date, and link
    // Based on the site structure, each article has a heading, a date, and a "Read more" link
    $('h2, h3').each(function() {
      const title = $(this).text().trim();
      if (title && !title.includes('הטור של גיא נתן')) { // Skip the header title
        // Find date - it's typically a text node after the heading
        const dateText = $(this).next().text().trim();
        
        // Find the "Read more" link
        const readMoreLink = $(this).next().next().attr('href');
        
        if (dateText && readMoreLink) {
          const publishedAt = parseHebrewDate(dateText);
          
          articles.push({
            title,
            publishedAt,
            link: readMoreLink,
            slug: slugify(title, { lower: true, strict: true, locale: 'he' }) + '-' + Date.now(),
            isPublished: true // Make sure to set this to true
          });
        }
      }
    });
    
    console.log(`Found ${articles.length} YNET articles on the website`);
    return articles;
  } catch (error) {
    console.error('Error scraping YNET articles:', error);
    return [];
  }
}

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Function to add articles to the database
async function addArticlesToDatabase(articles) {
  try {
    console.log(`Adding ${articles.length} YNET articles to the database...`);
    
    let addedCount = 0;
    let existingCount = 0;
    
    for (const article of articles) {
      // Check if article already exists (by title)
      const existing = await YnetArticle.findOne({ title: article.title });
      
      if (existing) {
        // Update isPublished to true
        await YnetArticle.updateOne(
          { _id: existing._id },
          { $set: { isPublished: true } }
        );
        existingCount++;
        console.log(`Updated existing article: ${article.title}`);
      } else {
        // Add new article
        await YnetArticle.create(article);
        addedCount++;
        console.log(`Added new article: ${article.title}`);
      }
    }
    
    console.log(`Added ${addedCount} new articles and updated ${existingCount} existing articles`);
  } catch (error) {
    console.error('Error adding articles to the database:', error);
  }
}

// Function to update all YNET articles
async function updateAllArticles() {
  try {
    console.log('Setting isPublished=true for all existing YNET articles...');
    
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
  } catch (error) {
    console.error('Error updating YNET articles:', error);
  }
}

// Run the main function
async function main() {
  try {
    await connectToDatabase();
    
    // First update all existing articles to ensure isPublished is set
    await updateAllArticles();
    
    // Then scrape new articles from the website
    const articles = await scrapeYnetArticles();
    
    if (articles.length > 0) {
      await addArticlesToDatabase(articles);
    }
    
    console.log('Script completed successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main(); 