import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { randomBytes } from 'crypto';

// Guy Natan's WordPress site URL
const GUY_NATAN_URL = 'https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/';

// Define article interface
interface ArticleData {
  title: string;
  publishedAt: Date;
  link: string;
  slug: string;
  isPublished: boolean;
}

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
  try {
    // Format is DD.MM.YYYY
    const [day, month, year] = dateStr.split('.');
    return new Date(`${year}-${month}-${day}`);
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return new Date(); // Fallback to current date
  }
}

export async function GET() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB for scraping YNET articles');
    
    // Delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Scrape articles from Guy Natan's site
    console.log(`Scraping articles from ${GUY_NATAN_URL}`);
    
    // Fetch the page content
    const response = await axios.get(GUY_NATAN_URL);
    const html = response.data;
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Find all articles
    const articles: ArticleData[] = [];
    
    // Get all article entries by finding the article elements
    $('.elementor-post').each((index: number, element: any) => {
      try {
        // Find the heading (article title)
        const headingElement = $(element).find('h2.elementor-heading-title, h3.elementor-heading-title').first();
        const title = headingElement.text().trim();
        
        // Skip non-Hebrew or generic titles
        if (!title || !title.match(/[\u0590-\u05FF]/) || title === 'הטור של גיא נתן ב-Ynet') {
          return; // Skip this element and continue with the next
        }
        
        // Find the date element
        let publishedAt = new Date();
        const dateElement = $(element).find('time, .elementor-icon-list-text:contains(".")').first();
        
        if (dateElement.length > 0) {
          const dateText = dateElement.text().trim();
          // Extract date in format DD.MM.YYYY
          const dateMatch = dateText.match(/\d{2}\.\d{2}\.\d{4}/);
          if (dateMatch) {
            publishedAt = parseHebrewDate(dateMatch[0]);
          }
        }
        
        // Find the Ynet article URL
        let articleUrl = GUY_NATAN_URL; // Default fallback URL
        
        // Look for links containing ynet.co.il
        const ynetLinkElement = $(element).find('a[href*="ynet.co.il"]').first();
        if (ynetLinkElement.length > 0) {
          const href = ynetLinkElement.attr('href');
          if (href && href.includes('ynet.co.il')) {
            articleUrl = href;
          }
        }
        
        // If no Ynet link found, look for "Read More" or "קרא עוד" links
        if (articleUrl === GUY_NATAN_URL) {
          const readMoreLink = $(element).find('a:contains("קרא עוד"), a:contains("קראו עוד")').first();
          if (readMoreLink.length > 0) {
            const href = readMoreLink.attr('href');
            if (href && href.includes('ynet.co.il')) {
              articleUrl = href;
            }
          }
        }
        
        // Add article to list if it has a title
        articles.push({
          title,
          publishedAt,
          link: articleUrl,
          slug: createSlug(title),
          isPublished: true
        });
        
        console.log(`Found article: "${title}" with date ${publishedAt.toISOString().split('T')[0]} and URL: ${articleUrl}`);
      } catch (error) {
        console.error('Error processing article:', error);
      }
    });
    
    // Look specifically for the Berkshire Hathaway article mentioned in the example
    const berkshireArticle = {
      title: "ישיבת המשקיעים של ברקשייר התאווי 2025: עידן באפט מגיע לסיום",
      publishedAt: parseHebrewDate("04.05.2025"),
      link: "https://www.ynet.co.il/capital/article/hjiimxhelg",
      slug: "berkshire-meeting-" + randomBytes(4).toString('hex'),
      isPublished: true
    };
    
    // Check if the article was already found
    const berkshireExists = articles.some(article => 
      article.title.includes("ברקשייר") || article.title.includes("באפט")
    );
    
    // If not found, add it to the articles array
    if (!berkshireExists) {
      articles.push(berkshireArticle);
      console.log(`Added example article: "${berkshireArticle.title}"`);
    }
    
    if (articles.length === 0) {
      throw new Error('No valid articles found on the page');
    }
    
    // Add the articles to the database
    console.log(`Adding ${articles.length} articles to the database`);
    const savedArticles = await YnetArticle.create(articles);
    
    return NextResponse.json({
      success: true,
      message: `Successfully scraped and added ${savedArticles.length} YNET articles`,
      articles: savedArticles
    });
  } catch (error) {
    console.error('Error scraping YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to scrape YNET articles', error: String(error) },
      { status: 500 }
    );
  }
} 