// This script adds test YNET articles through the API endpoint
// Run with: node scripts/add-test-ynet-article.js

import fetch from 'node-fetch';

// Define the API endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Sample YNET articles data
const sampleArticles = [
  {
    title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
    publishedAt: new Date("2025-05-09").toISOString(),
    link: "https://www.ynet.co.il/economy/article/sample-article-1",
    slug: `gal-hitikruiot-${Date.now()}`,
    isPublished: true
  },
  {
    title: "חדשות הטכנולוגיה: פיתוחים חדשים בתחום הבינה המלאכותית",
    publishedAt: new Date("2025-05-08").toISOString(),
    link: "https://www.ynet.co.il/technology/article/sample-article-2",
    slug: `tech-news-ai-${Date.now() + 1}`,
    isPublished: true
  },
  {
    title: "מחקר חדש: השפעת האקלים על החקלאות בישראל",
    publishedAt: new Date("2025-05-07").toISOString(),
    link: "https://www.ynet.co.il/science/article/sample-article-3",
    slug: `climate-research-${Date.now() + 2}`,
    isPublished: true
  }
];

// Function to add a test article
async function addTestArticle(article) {
  try {
    console.log('Adding test YNET article through API...');
    console.log('Article data:', article);

    // Make the API request to create the article
    const response = await fetch(`${API_URL}/api/ynet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });

    // Parse and log the response
    const result = await response.json();
    
    if (response.ok) {
      console.log('Test article added successfully!');
      console.log('Response:', result);
      return true;
    } else {
      console.error('Failed to add test article!');
      console.error('Status:', response.status);
      console.error('Response:', result);
      return false;
    }
  } catch (error) {
    console.error('Error adding test article:', error);
    return false;
  }
}

// Function to add all test articles
async function addAllTestArticles() {
  console.log(`Adding ${sampleArticles.length} test YNET articles...`);
  
  for (const article of sampleArticles) {
    await addTestArticle(article);
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('Completed adding test articles');
}

// Run the function
addAllTestArticles(); 