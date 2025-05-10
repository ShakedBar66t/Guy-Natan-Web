// Blog Migration Script for Guy Natan Website
// This script scrapes blog posts from the old website and migrates them to the new site

const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const slugify = require('slugify');
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

// Blog post model definition (copied from your existing model)
const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this blog post.'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content for this blog post.'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    preview: {
      type: String,
      maxlength: [500, 'Preview cannot be more than 500 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug for this blog post.'],
      unique: true,
    },
    coverImage: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ['finance', 'investing', 'economy', 'personal-finance', 'uncategorized'],
      default: 'uncategorized',
    },
    tags: [{
      type: String,
    }],
    relatedTerms: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinancialTerm',
    }],
    author: {
      type: String,
      default: 'גיא נתן',
    },
    originalUrl: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// Main scraping and migration function
async function migrateBlogs() {
  try {
    console.log('Will attempt to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Initialize blog post model
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

    // Main blogs page URL
    const BLOG_URL = 'https://guynatan.com/%d7%9e%d7%90%d7%9e%d7%a8%d7%99%d7%9d/';
    console.log(`Fetching blog list from ${BLOG_URL}`);

    // Fetch the main blogs page
    const response = await axios.get(BLOG_URL);
    const $ = cheerio.load(response.data);

    // Guy Natan's site has blog articles with specific structure
    // Each blog preview is in a section with heading and summary
    const blogPreviews = [];

    // Based on the screenshot, looking specifically for the blog cards
    console.log("Trying to extract blog preview cards...");
    
    // Target each blog post card specifically - finding headers with preview content
    $('.post, article, .blog-item, section').each(function() {
      const $card = $(this);
      const blogPreview = {};
      
      // Find the title using selectors that match the screenshot
      const $title = $card.find('h2, h3, .post-title').first();
      if ($title.length) {
        blogPreview.title = $title.text().trim();
        
        // Find the link
        let link = null;
        const $titleLink = $title.find('a').first();
        if ($titleLink.length) {
          link = $titleLink.attr('href');
        } else {
          const $readMoreLink = $card.find('a:contains("קרא עוד")').first();
          if ($readMoreLink.length) {
            link = $readMoreLink.attr('href');
          }
        }
        
        if (link) {
          blogPreview.link = link;
        }
      }
      
      // Find the date, looking specifically for the date format in the screenshot
      const $date = $card.find('.date, time, [class*="date"]').first();
      if ($date.length) {
        blogPreview.date = $date.text().trim();
        console.log(`Found date: ${blogPreview.date} for post: ${blogPreview.title}`);
      }
      
      // Enhanced preview extraction - looking specifically for תקציר (preview/summary)
      // First, try to find the preview text in a paragraph element
      let $preview = $card.find('p').first();
      
      // The preview text might also be in a div with a specific class
      if (!$preview.length || $preview.text().trim().length < 10) {
        $preview = $card.find('.elementor-post__excerpt, .excerpt, .entry-summary, .post-excerpt').first();
      }
      
      // If still not found, look for any div containing text
      if (!$preview.length || $preview.text().trim().length < 10) {
        // Find any element that might contain preview text
        $card.find('div').each(function() {
          const $div = $(this);
          const text = $div.text().trim();
          if (text.length > 20 && text.length < 300 && !text.includes('קרא עוד') && 
              !text.includes(blogPreview.title) && !text.includes(blogPreview.date)) {
            $preview = $div;
            return false; // Break the loop
          }
        });
      }
      
      if ($preview && $preview.length) {
        const previewText = $preview.text().trim();
        if (previewText.length > 10) {
          blogPreview.preview = previewText;
          console.log(`Found preview text: "${blogPreview.preview.substring(0, 50)}..." for post: ${blogPreview.title}`);
        }
      }
      
      // Only add if we have essential info
      if (blogPreview.title && blogPreview.link && blogPreview.preview) {
        blogPreviews.push(blogPreview);
      }
    });
    
    console.log(`Found ${blogPreviews.length} blog previews`);
    
    // Remove duplicates based on URL/link
    const uniqueBlogs = [];
    const seenLinks = new Set();
    
    for (const blog of blogPreviews) {
      if (!seenLinks.has(blog.link)) {
        seenLinks.add(blog.link);
        uniqueBlogs.push(blog);
      }
    }
    
    console.log(`Found ${uniqueBlogs.length} unique blog posts after removing duplicates`);
    
    // Process all blogs rather than just testing with one
    const blogs = uniqueBlogs;
    console.log(`Will process ${blogs.length} blogs`);
    
    // Track migration statistics
    let successCount = 0;
    let errorCount = 0;
    
    // Process each blog
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      console.log(`Processing blog ${i+1}/${blogs.length}: ${blog.title}`);
      
      try {
        // Check specifically for S&P blog and use the correct preview
        if (blog.title && blog.title.includes('S&P')) {
          // Search through all blog previews for the correct preview text about S&P
          for (const blogPreview of blogPreviews) {
            if (blogPreview.title === blog.title && 
                blogPreview.preview && 
                blogPreview.preview.includes('סקירה מקיפה')) {
              console.log(`Found more specific preview for S&P post: "${blogPreview.preview.substring(0, 50)}..."`);
              // Clean the preview to ensure no HTML tags
              blog.preview = blogPreview.preview.replace(/<[^>]*>/g, '').trim();
              break;
            }
          }
        }
        
        // Generate a slug from the title
        let slug = slugify(blog.title, {
          lower: true,
          strict: true,
          locale: 'he'
        });
        
        // If slugify fails to generate a valid slug (common with Hebrew text),
        // create a simple post- prefix with a timestamp
        if (!slug || slug.length < 3) {
          slug = `post-${Date.now()}-${i}`;
        } else {
          // Ensure the slug has a minimum length and is unique by adding timestamp and index
          slug = `post-${slug}-${Date.now().toString().slice(-4)}-${i}`;
        }
        
        // Fetch the full blog content
        const blogData = await fetchBlogContent(blog);
        
        // Convert Hebrew date format (DD/MM/YYYY) to JavaScript Date
        let publishedDate = new Date();
        if (blog.date) {
          // Clean up the date string and extract numbers
          const dateString = blog.date.trim().replace(/[^\d\/]/g, '');
          console.log(`Processing date: ${dateString} for blog: ${blog.title}`);
          
          // Try to parse DD/MM/YYYY format
          const dateParts = dateString.split('/');
          if (dateParts.length === 3) {
            try {
              // Israeli format is typically DD/MM/YYYY
              publishedDate = new Date(
                parseInt(dateParts[2]), // Year
                parseInt(dateParts[1]) - 1, // Month (0-indexed)
                parseInt(dateParts[0]) // Day
              );
              
              // Check if the date is valid
              if (isNaN(publishedDate.getTime())) {
                console.log(`Invalid date format for: ${blog.title}, using current date`);
                publishedDate = new Date();
              } else {
                console.log(`Successfully parsed date: ${publishedDate.toISOString()} for: ${blog.title}`);
              }
            } catch (error) {
              console.log(`Error parsing date for: ${blog.title}, using current date`);
              publishedDate = new Date();
            }
          } else {
            // If we can't parse the date format, try to extract year, month, day from URL
            try {
              const urlDateMatch = blog.link.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
              if (urlDateMatch && urlDateMatch.length === 4) {
                publishedDate = new Date(
                  parseInt(urlDateMatch[1]), // Year
                  parseInt(urlDateMatch[2]) - 1, // Month (0-indexed)
                  parseInt(urlDateMatch[3]) // Day
                );
                console.log(`Extracted date from URL: ${publishedDate.toISOString()} for: ${blog.title}`);
              } else {
                console.log(`Couldn't parse date for: ${blog.title}, using current date`);
              }
            } catch (error) {
              console.log(`Error extracting date from URL for: ${blog.title}, using current date`);
            }
          }
        }
        
        // Create new blog post
        const newBlogPost = new BlogPost({
          title: blog.title,
          content: blogData.content || 'No content found',
          excerpt: blogData.excerpt || 'No excerpt available',
          preview: blog.preview || 'No preview available',
          slug: slug,
          coverImage: blogData.coverImage || '',
          isPublished: true,
          publishedAt: publishedDate,
          category: mapCategory(blogData.category || blog.title || ''),
          tags: blogData.tags || [],
          author: 'גיא נתן',
          originalUrl: blog.link
        });
        
        // Save to database
        await newBlogPost.save();
        console.log(`Successfully saved blog: ${blog.title}`);
        successCount++;
        
      } catch (error) {
        console.error(`Error processing blog ${blog.title}:`, error.message);
        errorCount++;
      }
      
      // Add a small delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\nBlog migration complete!`);
    console.log(`Successfully migrated: ${successCount} blogs`);
    console.log(`Failed to migrate: ${errorCount} blogs`);
    console.log(`Total blogs processed: ${blogs.length}`);
    
  } catch (error) {
    console.error('Error during blog migration:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Function to fetch full content of each blog post
async function fetchBlogContent(blogPost) {
  try {
    console.log(`Fetching content for: ${blogPost.title}`);
    
    const response = await axios.get(blogPost.link);
    const $ = cheerio.load(response.data);
    
    // Try more specific content selectors for WordPress blogs
    // Focus on element selectors that typically contain the main article content
    const contentSelectors = [
      '.entry-content',                    // Standard WordPress content container
      '.post-content',                     // Common in many themes
      'article .entry-content',            // More specific selector
      '.post .entry-content',              // Alternative with post parent
      '.single-post-content',              // Some themes use this
      '.elementor-widget-theme-post-content', // Elementor WordPress builder
      '.elementor-widget-container',       // Another Elementor container
      'main article .elementor-widget-container', // More specific Elementor
      '.content-area .entry-content',      // Common in many themes
      'article .post-content',             // Alternative structure
      'div[itemprop="articleBody"]',       // Schema.org markup
      '.post-body',                        // Simple theme structure
      '.post-entry',                       // Alternative naming
      '.post .entry',                      // Another common pattern
      'article',                           // Very general fallback
      '.content'                           // Ultimate fallback
    ];
    
    let content = '';
    let contentElement = null;
    let foundSelector = '';
    
    // Try each selector until content is found
    for (const selector of contentSelectors) {
      contentElement = $(selector);
      if (contentElement.length) {
        // Remove unwanted elements that might be inside the content area
        contentElement.find('script, style, .social-share, .comments, .navigation, .related-posts, .sidebar, footer, header, nav, .elementor-post__read-more, .elementor-post__title, .elementor-post__meta-data').remove();
        
        // Check if this element has substantial content
        const tempContent = contentElement.html();
        if (tempContent && tempContent.trim().length > 200) { // More strict minimum length
          // Wrap the content in a container with the wordpress-content class
          // This preserves the formatting and allows for custom styling
          content = `<div class="wordpress-content">${tempContent}</div>`;
          foundSelector = selector;
          console.log(`Found content using selector: ${selector} (${content.length} characters)`);
          break;
        }
      }
    }
    
    // Process images in the content - ensure they have absolute URLs and are properly sized
    if (content) {
      // Create a cheerio instance for the content to manipulate it
      const $content = cheerio.load(content);
      
      // Fix relative image URLs in the content but preserve all original attributes
      $content('img').each(function() {
        // Fix relative URLs
        let src = $content(this).attr('src');
        if (src && src.startsWith('/')) {
          $content(this).attr('src', `https://guynatan.com${src}`);
        }
        
        // Preserve original classes
        const originalClass = $content(this).attr('class') || '';
        $content(this).attr('class', `${originalClass} wp-image`);
      });
      
      // Ensure proper list formatting
      $content('ul, ol').each(function() {
        // Preserve original classes
        const originalClass = $content(this).attr('class') || '';
        if (!originalClass.includes('wp-list')) {
          $content(this).attr('class', `${originalClass} wp-list`);
        }
      });
      
      // Ensure proper heading formatting
      $content('h1, h2, h3, h4, h5, h6').each(function() {
        // Preserve original classes
        const originalClass = $content(this).attr('class') || '';
        if (!originalClass.includes('wp-heading')) {
          $content(this).attr('class', `${originalClass} wp-heading`);
        }
      });
      
      // Convert back to HTML - preserving all formatting
      content = $content.html();
    }
    
    // Extract all image URLs from the content as a separate array
    const images = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      images.push(match[1]);
    }
    
    if (images.length) {
      console.log(`Found ${images.length} images in the content`);
    }
    
    // Enhanced preview and excerpt extraction
    let preview = '';
    let excerpt = '';
    
    // First, use the preview from the blog listing page if available
    if (blogPost.preview && blogPost.preview.length > 20) {
      // Clean the preview - remove any HTML tags
      preview = blogPost.preview.replace(/<[^>]*>/g, '').trim();
      console.log(`Using preview from blog listing page: "${preview.substring(0, 50)}..."`);
    } else {
      // Try to find elements that might contain the preview text (תקציר)
      const previewSelectors = [
        // Elements specifically labeled as תקציר (preview/summary)
        'div:contains("תקציר")', 
        'p:contains("תקציר")',
        'h3:contains("תקציר")',
        'h4:contains("תקציר")',
        '.excerpt',
        '.summary',
        '.post-excerpt',
        // Meta description which often contains the preview
        'meta[name="description"]',
        // WordPress standard excerpt locations
        '.entry-summary',
        // First paragraph which often serves as a lead/intro
        'article p:first-of-type',
        '.entry-content p:first-of-type'
      ];
      
      // Try to find preview labeled specifically as תקציר
      for (const selector of previewSelectors) {
        let previewElement = $(selector);
        
        if (previewElement.length) {
          let foundText = '';
          
          // Handle meta tags differently
          if (selector.includes('meta')) {
            foundText = previewElement.attr('content');
          } else {
            // For elements containing תקציר, get the text after the label
            if (selector.includes(':contains("תקציר")')) {
              foundText = previewElement.text();
              const splitText = foundText.split('תקציר');
              if (splitText.length > 1) {
                foundText = splitText[1].trim();
                if (foundText.startsWith(':')) {
                  foundText = foundText.substring(1).trim();
                }
              }
            } else {
              // Get only the text content, not HTML that might include images
              foundText = previewElement.text().trim();
            }
          }
          
          if (foundText && foundText.length > 20) {
            preview = foundText;
            console.log(`Found preview text using selector "${selector}": "${preview.substring(0, 50)}..."`);
            break;
          }
        }
      }
    }
    
    // Make sure the preview doesn't contain any HTML tags or images
    preview = preview.replace(/<[^>]*>/g, '').trim();
    
    // Use preview for excerpt if good quality
    excerpt = preview;
    
    // Try to extract a cover image
    let coverImage = '';
    
    // First try to find a featured image
    const coverImageSelectors = [
      'meta[property="og:image"]',        // Open Graph image is often the featured image
      '.post-thumbnail img',              // Common WordPress featured image class
      '.featured-image img',              // Alternative featured image class
      'img.wp-post-image',                // WordPress post image class
      'article img:first-of-type',        // First image in the article
      '.entry-content img:first-of-type', // First image in the content
    ];
    
    for (const selector of coverImageSelectors) {
      const imgElement = $(selector);
      if (imgElement.length) {
        // Different ways to get the URL depending on the element type
        if (selector.includes('meta')) {
          coverImage = imgElement.attr('content');
        } else {
          coverImage = imgElement.attr('src') || imgElement.attr('data-src') || imgElement.attr('data-lazy-src');
        }
        
        if (coverImage) {
          // Fix relative URLs for images
          if (coverImage.startsWith('/')) {
            coverImage = `https://guynatan.com${coverImage}`;
          }
          console.log(`Found cover image: ${coverImage}`);
          break;
        }
      }
    }
    
    // We'll explicitly set coverImage to empty to prevent auto-using from content images
    // This ensures the blog post doesn't display an image at the top unless explicitly set later
    coverImage = '';
    
    // Try to extract category
    let category = '';
    const categoryElement = $('.category, .categories a, span.cat, .post-categories a').first();
    if (categoryElement.length) {
      category = categoryElement.text().trim();
      console.log(`Found category: ${category}`);
    }
    
    // Try to extract tags
    const tags = [];
    $('.tags a, .post-tags a, .post-meta-tags a').each(function() {
      tags.push($(this).text().trim());
    });
    if (tags.length > 0) {
      console.log(`Found tags: ${tags.join(', ')}`);
    }
    
    return {
      content: content || 'No content found',
      excerpt: excerpt || '',
      preview: preview || '',
      coverImage: coverImage,
      category: category,
      tags: tags,
      images: images
    };
  } catch (error) {
    console.error(`Error fetching blog content for ${blogPost.title}:`, error.message);
    return {
      content: 'Error fetching content: ' + error.message,
      excerpt: blogPost.preview || '',
      preview: blogPost.preview || '',
      coverImage: '',
      category: '',
      tags: [],
      images: []
    };
  }
}

// Map category based on content keywords
function mapCategory(hebrewText) {
  // Category mapping with common Hebrew financial terms
  const categoryMap = {
    'פיננסים': 'פיננסים',
    'כלכלה': 'כלכלה',
    'השקעות': 'השקעות',
    'שוק ההון': 'השקעות',
    'תכנון פיננסי': 'כלכלה אישית',
    'כסף': 'פיננסים',
    'בנקים': 'פיננסים',
    'נדלן': 'כלכלה',
    'נדל"ן': 'כלכלה',
    'מניות': 'השקעות',
    'בורסה': 'השקעות',
    'משכנתא': 'כלכלה אישית',
    'ביטוח': 'כלכלה אישית',
    'פנסיה': 'כלכלה אישית',
    'חסכון': 'כלכלה אישית',
    'חיסכון': 'כלכלה אישית',
    'אינפלציה': 'כלכלה',
    'ריבית': 'כלכלה',
    'דולר': 'כלכלה',
    'מיסוי': 'כלכלה אישית',
    'מס': 'כלכלה אישית',
    'אג"ח': 'השקעות',
    'דיבידנד': 'השקעות'
  };
  
  // First check for direct category matches
  for (const [hebrew, category] of Object.entries(categoryMap)) {
    if (hebrewText.includes(hebrew)) {
      return category;
    }
  }
  
  // Look for keywords in the title to determine category
  const lowerText = hebrewText.toLowerCase();
  
  // Investing related keywords
  if (lowerText.includes('מניה') || 
      lowerText.includes('השקעה') || 
      lowerText.includes('בורסה') ||
      lowerText.includes('מכפיל') ||
      lowerText.includes('s&p') ||
      lowerText.includes('מדד') ||
      lowerText.includes('תשואה')) {
    return 'השקעות';
  }
  
  // Economy related keywords
  if (lowerText.includes('כלכל') || 
      lowerText.includes('נדל"ן') ||
      lowerText.includes('נדלן') ||
      lowerText.includes('אינפלציה') ||
      lowerText.includes('ריבית') ||
      lowerText.includes('דולר') ||
      lowerText.includes('מדינה') ||
      lowerText.includes('תקציב') || 
      lowerText.includes('אוצר')) {
    return 'כלכלה';
  }
  
  // Personal finance related keywords
  if (lowerText.includes('משכנתא') || 
      lowerText.includes('פנסיה') ||
      lowerText.includes('חסכון') ||
      lowerText.includes('חיסכון') ||
      lowerText.includes('ביטוח') ||
      lowerText.includes('פיצויים') ||
      lowerText.includes('מיסוי') ||
      lowerText.includes('מס ') || 
      lowerText.includes('שכר')) {
    return 'כלכלה אישית';
  }
  
  // Finance (general) keywords
  if (lowerText.includes('פיננס') || 
      lowerText.includes('בנק') ||
      lowerText.includes('כסף') ||
      lowerText.includes('אשראי') || 
      lowerText.includes('פקדונות') ||
      lowerText.includes('פיקדון')) {
    return 'פיננסים';
  }
  
  // Default to general category if no match
  return 'כללי';
}

// Run the migration
migrateBlogs().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 