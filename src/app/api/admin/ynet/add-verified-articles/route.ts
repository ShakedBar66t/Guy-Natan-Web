import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import { randomBytes } from 'crypto';

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
    console.log('Connected to MongoDB for adding verified Ynet articles');
    
    // First, delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Add Guy Natan's known YNET articles with verified, correct URLs
    const carFinanceArticle = {
      title: "משבר מתקרב? מצב המימון לרכישת רכבים בישראל",
      publishedAt: parseHebrewDate("25.04.2025"),
      link: "https://www.ynet.co.il/capital/article/rjqqgbikgl", // Verified URL
      slug: createSlug("משבר מתקרב? מצב המימון לרכישת רכבים בישראל"),
      isPublished: true
    };
    
    const berkshireArticle = {
      title: "ישיבת המשקיעים של ברקשייר התאווי 2025: עידן באפט מגיע לסיום",
      publishedAt: parseHebrewDate("04.05.2025"),
      link: "https://www.ynet.co.il/capital/article/hjiimxhelg", // Verified URL
      slug: createSlug("ישיבת המשקיעים של ברקשייר התאווי 2025: עידן באפט מגיע לסיום"),
      isPublished: true
    };
    
    // Add other articles with verifiable URLs
    const articles: ArticleData[] = [
      carFinanceArticle,
      berkshireArticle,
      {
        title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
        publishedAt: parseHebrewDate("09.05.2025"),
        link: "https://www.ynet.co.il/economy/article/s1awlphwq",
        slug: createSlug("גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון"),
        isPublished: true
      },
      {
        title: "מאסק מזהיר: סין בונה יתרון אנרגיה מסוכן, וארה\"ב עלולה להישאר מאחור",
        publishedAt: parseHebrewDate("02.05.2025"),
        link: "https://www.ynet.co.il/economy/article/byoq9vwlc",
        slug: createSlug("מאסק מזהיר: סין בונה יתרון אנרגיה מסוכן"),
        isPublished: true
      },
      {
        title: "הלוואות קבלן, תמונת מצב: על השינוי שעבר שוק הנדל\"ן בישראל",
        publishedAt: parseHebrewDate("27.04.2025"),
        link: "https://www.ynet.co.il/economy/article/rjl5cz00c",
        slug: createSlug("הלוואות קבלן תמונת מצב"),
        isPublished: true
      },
      {
        title: "שקל 2.0: איך הכסף הדיגיטלי עומד לשנות את הארנק – ואת הבנק",
        publishedAt: parseHebrewDate("18.04.2025"),
        link: "https://www.ynet.co.il/economy/article/b1q00fupjh",
        slug: createSlug("שקל 2.0 איך הכסף הדיגיטלי עומד לשנות את הארנק"),
        isPublished: true
      }
    ];

    console.log(`Adding ${articles.length} verified Ynet articles to the database`);
    
    // Add special highlight for the car finance article to verify it has the correct URL
    console.log(`Car finance article URL: ${carFinanceArticle.link}`);
    
    // Add the articles to the database
    const savedArticles = await YnetArticle.create(articles);
    
    return NextResponse.json({
      success: true,
      message: `Successfully added ${savedArticles.length} verified Ynet articles`,
      articles: savedArticles,
      carFinanceArticle: carFinanceArticle // Highlight this article specifically
    });
  } catch (error) {
    console.error('Error adding verified Ynet articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add verified Ynet articles', error: String(error) },
      { status: 500 }
    );
  }
} 