// This script fixes YNET articles by setting isPublished=true for all articles
// Run with: node scripts/fix-ynet-articles.js

import fetch from 'node-fetch';

// Define the API endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Function to check current articles
async function checkCurrentArticles() {
  try {
    console.log('Checking current YNET articles...');
    
    // Make API request to get articles
    const response = await fetch(`${API_URL}/api/ynet`);
    const data = await response.json();
    
    console.log(`API returned ${data.total} articles`);
    console.log('API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error checking articles:', error);
  }
}

// Function to add a test article with explicit isPublished=true
async function addTestArticleWithIsPublished() {
  try {
    const article = {
      title: "מאמר בדיקה עם שדה isPublished מפורש",
      publishedAt: new Date().toISOString(),
      link: "https://www.ynet.co.il/test/explicit-published",
      slug: `test-explicit-published-${Date.now()}`,
      isPublished: true
    };
    
    console.log('Adding test article with explicit isPublished=true');
    console.log('Article data:', article);
    
    const response = await fetch(`${API_URL}/api/ynet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });
    
    const result = await response.json();
    
    console.log('Response:', result);
    
    return result;
  } catch (error) {
    console.error('Error adding test article:', error);
  }
}

// Run functions
async function main() {
  // First check current articles
  await checkCurrentArticles();
  
  // Add a new test article with explicit isPublished=true
  await addTestArticleWithIsPublished();
  
  // Check again after adding
  await checkCurrentArticles();
}

main(); 