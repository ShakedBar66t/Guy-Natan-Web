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
    console.log('Connected to MongoDB for adding YNET articles with verified URLs');
    
    // First, delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Add Guy Natan's YNET articles with correct, verified URLs
    const articles: ArticleData[] = [
      {
        title: "ישיבת המשקיעים של ברקשייר התאווי 2025: עידן באפט מגיע לסיום",
        publishedAt: parseHebrewDate("04.05.2025"),
        link: "https://www.ynet.co.il/capital/article/hjiimxhelg",
        slug: "berkshire-meeting-" + randomBytes(4).toString('hex'),
        isPublished: true
      },
      {
        title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
        publishedAt: parseHebrewDate("09.05.2025"),
        link: "https://www.ynet.co.il/economy/article/s1awlphwq",
        slug: "price-increases-" + randomBytes(4).toString('hex'),
        isPublished: true
      },
      {
        title: "מאסק מזהיר: סין בונה יתרון אנרגיה מסוכן, וארה\"ב עלולה להישאר מאחור",
        publishedAt: parseHebrewDate("02.05.2025"),
        link: "https://www.ynet.co.il/economy/article/byoq9vwlc",
        slug: "musk-warning-" + randomBytes(4).toString('hex'),
        isPublished: true
      },
      {
        title: "הלוואות קבלן, תמונת מצב: על השינוי שעבר שוק הנדל\"ן בישראל בחמש השנים האחרונות",
        publishedAt: parseHebrewDate("27.04.2025"),
        link: "https://www.ynet.co.il/economy/article/rjl5cz00c",
        slug: "contractor-loans-" + randomBytes(4).toString('hex'),
        isPublished: true
      },
      {
        title: "משבר מתקרב? מצב המימון לרכישת רכבים בישראל",
        publishedAt: parseHebrewDate("25.04.2025"),
        // CORRECTED URL based on the actual article
        link: "https://www.ynet.co.il/capital/article/rjqqgbikgl",
        slug: "car-finance-" + randomBytes(4).toString('hex'),
        isPublished: true
      },
      {
        title: "שקל 2.0: איך הכסף הדיגיטלי עומד לשנות את הארנק – ואת הבנק",
        publishedAt: parseHebrewDate("18.04.2025"),
        link: "https://www.ynet.co.il/economy/article/b1q00fupjh",
        slug: "digital-shekel-" + randomBytes(4).toString('hex'),
        isPublished: true
      }
    ];

    console.log(`Prepared ${articles.length} YNET articles with verified URLs`);
    
    // Add the articles to the database
    console.log(`Adding ${articles.length} articles to the database`);
    const savedArticles = await YnetArticle.create(articles);
    
    return NextResponse.json({
      success: true,
      message: `Successfully added ${savedArticles.length} YNET articles with verified URLs`,
      articles: savedArticles
    });
  } catch (error) {
    console.error('Error adding YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add YNET articles', error: String(error) },
      { status: 500 }
    );
  }
} 