import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import slugify from 'slugify';

// This API endpoint will add multiple YNET articles with proper dates
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding multiple YNET articles');
    
    // First, delete all existing articles
    await YnetArticle.deleteMany({});
    
    // Create multiple articles with different dates for sorting
    const articlesData = [
      {
        title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
        publishedAt: new Date("2025-05-09"),
        link: "https://www.ynet.co.il/capital/article/rkxnoxrggx",
        slug: "price-increases-" + Date.now(),
        isPublished: true
      },
      {
        title: "ישיבת המשקיעים של ברקשייר התאווי 2025: עידן באפט מגיע לסיום",
        publishedAt: new Date("2025-05-04"),
        link: "https://www.ynet.co.il/capital/article/buffer-end",
        slug: "berkshire-meeting-" + Date.now(),
        isPublished: true
      },
      {
        title: "מאסק מזהיר: סין בונה יתרון אנרגיה מסוכן, וארה\"ב עלולה להישאר מאחור",
        publishedAt: new Date("2025-05-02"),
        link: "https://www.ynet.co.il/capital/article/musk-warning",
        slug: "musk-warning-" + Date.now(),
        isPublished: true
      },
      {
        title: "הלוואות קבלן, תמונת מצב: על השינוי שעבר שוק הנדל\"ן בישראל בחמש השנים האחרונות",
        publishedAt: new Date("2025-04-27"),
        link: "https://www.ynet.co.il/capital/article/real-estate-loans",
        slug: "contractor-loans-" + Date.now(),
        isPublished: true
      },
      {
        title: "משבר מתקרב? מצב המימון לרכישת רכבים בישראל",
        publishedAt: new Date("2025-04-25"),
        link: "https://www.ynet.co.il/capital/article/car-finance",
        slug: "car-finance-" + Date.now(),
        isPublished: true
      },
      {
        title: "שקל 2.0: איך הכסף הדיגיטלי עומד לשנות את הארנק – ואת הבנק",
        publishedAt: new Date("2025-04-18"),
        link: "https://www.ynet.co.il/capital/article/digital-shekel",
        slug: "digital-shekel-" + Date.now(),
        isPublished: true
      }
    ];
    
    // Add all the articles to the database
    const savedArticles = await YnetArticle.create(articlesData);
    
    console.log(`Added ${savedArticles.length} YNET articles with different dates`);
    
    return NextResponse.json({
      success: true,
      message: `Added ${savedArticles.length} YNET articles with different dates`,
      articles: savedArticles
    });
  } catch (error) {
    console.error('Error adding multiple YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add multiple YNET articles', error: String(error) },
      { status: 500 }
    );
  }
} 