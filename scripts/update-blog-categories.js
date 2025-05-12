/**
 * Script to update all blog post categories to the new structure
 * 
 * This script will:
 * 1. Connect to MongoDB
 * 2. Find all blog posts
 * 3. Update their categories according to the new structure:
 *    - 'השקעות', 'כלכלה', 'כלכלה אישית' -> 'שוק ההון'
 *    - 'כללי', 'פיננסים' -> 'פיננסים'
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load MongoDB URI from .env.local file
let MONGODB_URI;
try {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    console.log('Loading MongoDB URI from .env.local');
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match && match[1]) {
      MONGODB_URI = match[1];
      console.log('MongoDB URI loaded successfully');
    }
  }
} catch (error) {
  console.error('Error loading MongoDB URI from .env.local:', error.message);
}

if (!MONGODB_URI) {
  console.error('MongoDB URI not found. Please ensure your .env.local file has a MONGODB_URI variable.');
  process.exit(1);
}

// Blog post model definition
const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    slug: String,
    excerpt: String,
    coverImage: String,
    isPublished: Boolean,
    publishedAt: Date,
    scheduledPublishDate: Date,
    category: String,
    level: String,
    relatedTerms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FinancialTerm' }],
    author: String,
  },
  {
    timestamps: true,
  }
);

// Category mapping function
function mapToNewCategory(oldCategory) {
  if (['השקעות', 'כלכלה', 'כלכלה אישית'].includes(oldCategory)) {
    return 'שוק ההון';
  } else {
    // 'כללי', 'פיננסים', or any undefined/null values
    return 'פיננסים';
  }
}

// Main function to update categories
async function updateBlogCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Initialize blog post model
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

    // Get all blog posts
    const blogPosts = await BlogPost.find({});
    console.log(`Found ${blogPosts.length} blog posts to update`);

    let updatedCount = 0;
    let categoryCounts = {
      'פיננסים': 0,
      'שוק ההון': 0
    };

    // Update each blog post
    for (const blog of blogPosts) {
      const oldCategory = blog.category;
      const newCategory = mapToNewCategory(oldCategory);
      
      // Update the blog post with the new category
      await BlogPost.updateOne(
        { _id: blog._id }, 
        { $set: { category: newCategory } }
      );
      
      console.log(`Updated: "${blog.title.substring(0, 30)}..." | ${oldCategory || 'undefined'} -> ${newCategory}`);
      categoryCounts[newCategory]++;
      updatedCount++;
    }

    console.log('\nCategory update complete!');
    console.log(`Total blog posts processed: ${blogPosts.length}`);
    console.log(`Total posts updated: ${updatedCount}`);
    console.log('New category distribution:');
    for (const [category, count] of Object.entries(categoryCounts)) {
      console.log(`- ${category}: ${count} posts`);
    }
    
  } catch (error) {
    console.error('Error during category update:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the update function
updateBlogCategories(); 