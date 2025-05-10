const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

// Try to load environment variables from .env.local first
let MONGODB_URI;
try {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    console.log('Loading MongoDB URI from .env.local');
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match && match[1]) {
      MONGODB_URI = match[1];
    }
  }
} catch (error) {
  console.error('Error loading MongoDB URI from .env.local:', error.message);
}

if (!MONGODB_URI) {
  console.error('MongoDB URI not found. Please ensure your .env.local file has a MONGODB_URI variable.');
  process.exit(1);
}

// Define Ynet Article Schema
const YnetArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  link: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Define the model
const YnetArticle = mongoose.models.YnetArticle || mongoose.model('YnetArticle', YnetArticleSchema);

async function addArticlesToDatabase() {
  try {
    console.log('Loading articles from ynet-articles.json...');
    const articles = JSON.parse(fs.readFileSync('ynet-articles.json', 'utf8'));
    
    if (articles.length === 0) {
      console.log('No articles found in file');
      return;
    }
    
    console.log(`Found ${articles.length} articles to add to database`);
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    
    // First, delete all existing articles
    console.log('Deleting existing articles...');
    const result = await YnetArticle.deleteMany({});
    console.log(`Deleted ${result.deletedCount} articles successfully!`);
    
    // Add all articles
    console.log('Adding articles to database...');
    let addedCount = 0;
    let errors = [];
    
    for (const article of articles) {
      try {
        const newArticle = new YnetArticle({
          title: article.title,
          publishedAt: new Date(article.publishedAt),
          link: article.link,
          slug: article.slug,
          isPublished: article.isPublished === undefined ? true : article.isPublished
        });
        
        await newArticle.save();
        addedCount++;
        
        // Log progress every 10 articles
        if (addedCount % 10 === 0) {
          console.log(`Added ${addedCount} of ${articles.length} articles...`);
        }
      } catch (error) {
        console.error(`Error adding article "${article.title}": ${error.message}`);
        errors.push({ title: article.title, error: error.message });
      }
    }
    
    console.log(`\nArticles added successfully: ${addedCount} of ${articles.length}`);
    
    if (errors.length > 0) {
      console.log(`\nEncountered ${errors.length} errors:`);
      errors.forEach((err, index) => {
        console.log(`${index + 1}. Error with "${err.title}": ${err.error}`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    // Close the database connection
    if (mongoose.connection.readyState === 1) {
      console.log('Closing database connection...');
      await mongoose.connection.close();
      console.log('Database connection closed.');
    }
  }
}

// Run the database update
addArticlesToDatabase();
