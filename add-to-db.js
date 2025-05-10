const fs = require('fs');
const axios = require('axios');

async function addArticlesToDatabase() {
  try {
    console.log('Loading articles from ynet-articles.json...');
    const articles = JSON.parse(fs.readFileSync('ynet-articles.json', 'utf8'));
    
    if (articles.length === 0) {
      console.log('No articles found in file');
      return;
    }
    
    console.log(`Found ${articles.length} articles to add to database`);
    
    // First, delete all existing articles
    console.log('Deleting existing articles...');
    const deleteUrl = 'http://localhost:3000/api/admin/ynet/delete-all-articles';
    await axios.get(deleteUrl);
    
    // Then add the new articles - use GET method since POST seems to be giving 405 errors
    console.log(`Adding ${articles.length} new articles...`);
    
    // Add articles one by one using GET with query parameters
    let addedCount = 0;
    for (const article of articles) {
      try {
        const addUrl = `http://localhost:3000/api/admin/ynet/add-article?title=${encodeURIComponent(article.title)}&publishedAt=${encodeURIComponent(article.publishedAt)}&link=${encodeURIComponent(article.link)}&slug=${encodeURIComponent(article.slug)}&isPublished=true`;
        await axios.get(addUrl);
        addedCount++;
        
        // Log progress every 10 articles
        if (addedCount % 10 === 0) {
          console.log(`Added ${addedCount} of ${articles.length} articles...`);
        }
      } catch (e) {
        console.error(`Error adding article "${article.title}": ${e.message}`);
      }
    }
    
    console.log(`Articles added successfully: ${addedCount} of ${articles.length}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Run the database update
addArticlesToDatabase();
