// Script to translate blog categories from English to Hebrew
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

// Print the MongoDB URI (redacted for security)
const redactedURI = MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://[username]:[password]@');
console.log('MongoDB URI (redacted):', redactedURI);

// Blog post model definition
const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    excerpt: String,
    preview: String,
    slug: String,
    coverImage: String,
    isPublished: Boolean,
    publishedAt: Date,
    category: String,
    tags: [String],
    relatedTerms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinancialTerm',
    }],
    author: String,
    originalUrl: String
  },
  {
    timestamps: true,
  }
);

// Category translation map (English to Hebrew)
const categoryTranslations = {
  'finance': 'פיננסים',
  'investing': 'השקעות',
  'economy': 'כלכלה',
  'personal-finance': 'כלכלה אישית',
  'uncategorized': 'כללי'
};

// Function to determine best category for uncategorized posts
function determineBestCategory(blog) {
  const title = blog.title.toLowerCase();
  const content = blog.content.toLowerCase();
  const preview = blog.preview.toLowerCase();
  
  // Check for investing related keywords
  if (
    title.includes('מניה') || 
    title.includes('השקע') || 
    title.includes('בורסה') ||
    title.includes('תשואה') ||
    title.includes('תיק השקע') ||
    title.includes('מכפיל') ||
    content.includes('מניות') ||
    content.includes('השקעה') ||
    content.includes('השקעות') ||
    content.includes('בורסה') ||
    content.includes('מדד') ||
    content.includes('s&p') ||
    preview.includes('משקיע')
  ) {
    return 'השקעות';
  }
  
  // Check for economy related keywords
  if (
    title.includes('כלכל') || 
    title.includes('נדל"ן') ||
    title.includes('דולר') ||
    title.includes('מדינה') ||
    title.includes('תקציב') || 
    title.includes('אוצר') ||
    title.includes('אינפלציה') ||
    title.includes('ריבית') ||
    content.includes('גירעון') ||
    content.includes('המשק') ||
    content.includes('צמיחה כלכלית') ||
    content.includes('תוצר')
  ) {
    return 'כלכלה';
  }
  
  // Check for personal finance related keywords
  if (
    title.includes('משכנתא') || 
    title.includes('פנסיה') ||
    title.includes('חסכון') ||
    title.includes('חיסכון') ||
    title.includes('ביטוח') ||
    title.includes('פיצויים') ||
    title.includes('מיסוי') ||
    title.includes('מס ') || 
    title.includes('שכר') ||
    title.includes('אשראי') ||
    content.includes('משכנתא') ||
    content.includes('פנסיה') ||
    content.includes('חיסכון')
  ) {
    return 'כלכלה אישית';
  }
  
  // Check for general finance keywords
  if (
    title.includes('פיננס') || 
    title.includes('בנק') ||
    title.includes('כסף') ||
    title.includes('אשראי') || 
    title.includes('פקדונות') ||
    title.includes('פיקדון') ||
    content.includes('פיננסי') ||
    content.includes('בנקאות')
  ) {
    return 'פיננסים';
  }
  
  // Default to "כללי" if no specific category is determined
  return 'כללי';
}

// Main function to update categories
async function translateCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Initialize blog post model
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

    // Get all blog posts
    const blogPosts = await BlogPost.find({});
    console.log(`Found ${blogPosts.length} blog posts`);

    let updatedCount = 0;
    let uncategorizedCount = 0;

    // Update each blog post
    for (const blog of blogPosts) {
      let newCategory;
      
      // If the blog is uncategorized or has the default value, determine a better category
      if (!blog.category || blog.category === 'uncategorized') {
        newCategory = determineBestCategory(blog);
        uncategorizedCount++;
        console.log(`Determined category for "${blog.title.substring(0, 30)}...": ${newCategory}`);
      } else {
        // Translate existing category
        newCategory = categoryTranslations[blog.category] || 'כללי';
        console.log(`Translated category for "${blog.title.substring(0, 30)}...": ${blog.category} -> ${newCategory}`);
      }
      
      // Update the blog post with the new category
      await BlogPost.updateOne({ _id: blog._id }, { $set: { category: newCategory } });
      updatedCount++;
    }

    console.log(`\nCategory translation complete!`);
    console.log(`Total blog posts processed: ${blogPosts.length}`);
    console.log(`Blog posts with categories translated: ${updatedCount - uncategorizedCount}`);
    console.log(`Uncategorized blog posts now categorized: ${uncategorizedCount}`);
    
  } catch (error) {
    console.error('Error during category translation:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
translateCategories().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
}); 