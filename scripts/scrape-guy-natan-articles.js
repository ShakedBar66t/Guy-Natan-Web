// Script to scrape Guy Natan's articles from his WordPress site
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
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

// Parse Hebrew date string to Date object
function parseHebrewDate(dateStr) {
  // Format is DD.MM.YYYY
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
}

// Scrape articles from Guy Natan's WordPress site
async function scrapeGuyNatanArticles() {
  try {
    console.log(`Scraping articles from ${GUY_NATAN_URL}`);
    
    // Fetch the page content
    const response = await axios.get(GUY_NATAN_URL);
    const html = response.data;
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Find all article entries
    const articles = [];
    
    // Based on the website structure, looking for article headings and dates
    $('h2').each((i, elem) => {
      // Get the title
      const title = $(elem).text().trim();
      
      // Skip if title is not in Hebrew or doesn't look like an article title
      if (!title.match(/[\u0590-\u05FF]/) || title === 'הטור של גיא נתן ב-Ynet') {
        return;
      }
      
      // Find the date (which is the next element after "קראו עוד")
      const dateElement = $(elem).parent().find('time');
      let publishedAt = new Date();
      
      if (dateElement.length > 0) {
        const dateStr = dateElement.text().trim();
        if (dateStr.match(/\d{2}\.\d{2}\.\d{4}/)) {
          publishedAt = parseHebrewDate(dateStr);
        }
      }
      
      articles.push({
        title,
        publishedAt,
        link: GUY_NATAN_URL,
        slug: createSlug(title),
        isPublished: true
      });
    });
    
    console.log(`Found ${articles.length} articles on Guy Natan's WordPress site`);
    return articles;
  } catch (error) {
    console.error('Error scraping Guy Natan articles:', error);
    throw error;
  }
}

// Delete all existing YNET articles and add the scraped ones
async function updateYnetArticles(articles) {
  try {
    const YnetArticle = mongoose.model('YnetArticle', YnetArticleSchema);
    
    // Delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Create the scraped articles
    const savedArticles = await YnetArticle.create(articles);
    console.log(`Added ${savedArticles.length} Guy Natan YNET articles`);
    
    return savedArticles;
  } catch (error) {
    console.error('Error updating YNET articles:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    await connectToDatabase();
    
    // First scrape the articles
    const articles = await scrapeGuyNatanArticles();
    
    // Then update the database
    if (articles.length > 0) {
      await updateYnetArticles(articles);
    } else {
      console.log('No articles found, database not updated');
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