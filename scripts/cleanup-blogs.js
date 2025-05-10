// Script to clean up all existing blog posts in the database
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf-8')
  .split('\n')
  .filter(line => line.trim() !== '' && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    acc[key.trim()] = value.trim().replace(/^['\"]|['\"]$/g, '');
    return acc;
  }, {});

// Set environment variables
Object.keys(envConfig).forEach(key => {
  process.env[key] = envConfig[key];
});

// MongoDB Connection String from .env.local
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Fix the retryWrites parameter issue
if (MONGODB_URI.endsWith('retryWrites')) {
  MONGODB_URI += '=true';
  console.log('Fixed retryWrites parameter.');
}

// Blog post schema definition - minimal version just for deletion
const BlogPostSchema = new mongoose.Schema(
  { title: String },
  { timestamps: true }
);

async function cleanupBlogs() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Initialize blog post model
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

    // Count documents before deletion
    const countBefore = await BlogPost.countDocuments();
    console.log(`Found ${countBefore} blog posts in the database`);

    // Delete all blog posts
    const result = await BlogPost.deleteMany({});
    
    console.log(`Deleted ${result.deletedCount} blog posts from the database`);

    console.log('Blog cleanup completed successfully!');
  } catch (error) {
    console.error('Error during blog cleanup:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the cleanup
cleanupBlogs().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
}); 