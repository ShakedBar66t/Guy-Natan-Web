import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { randomBytes } from 'crypto';

// Guy Natan's WordPress site URL
const GUY_NATAN_URL = 'https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/';

// Generate a unique slug from title
function createSlug(title: string) {
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
function parseHebrewDate(dateStr: string) {
  // Format is DD.MM.YYYY
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`);
}

export async function GET() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB for scraping a single YNET article');
    
    // First, delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Scrape a single article from Guy Natan's site
    console.log(`Scraping article from ${GUY_NATAN_URL}`);
    
    // Fetch the page content
    const response = await axios.get(GUY_NATAN_URL);
    const html = response.data;
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Find the first article heading with Hebrew text
    let title = '';
    let publishedAt = new Date();
    let articleUrl = GUY_NATAN_URL;
    
    // Look for headings that contain Hebrew text
    $('h2').each((index: number, element: any) => {
      const headingText = $(element).text().trim();
      
      // Check if heading contains Hebrew characters
      if (headingText && headingText.match(/[\u0590-\u05FF]/) && !title) {
        title = headingText;
        
        // Find date element (typically in a time tag)
        const dateElement = $(element).parent().find('time').first();
        if (dateElement.length > 0) {
          const dateStr = dateElement.text().trim();
          if (dateStr.match(/\d{2}\.\d{2}\.\d{4}/)) {
            publishedAt = parseHebrewDate(dateStr);
          }
        }
        
        // Find the YNET URL if available
        const linkElement = $(element).parent().find('a[href*="ynet"]').first();
        if (linkElement.length > 0) {
          const href = linkElement.attr('href');
          if (href && href.includes('ynet')) {
            articleUrl = href;
          }
        }
        
        // Break after finding the first valid article
        return false;
      }
    });
    
    if (!title) {
      throw new Error('No valid Hebrew article title found');
    }
    
    // Create the article object
    const article = {
      title,
      publishedAt,
      link: articleUrl,
      slug: createSlug(title),
      isPublished: true
    };
    
    // Add the article to the database
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Successfully added article:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully scraped and added a single YNET article',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error scraping and adding YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to scrape and add YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 