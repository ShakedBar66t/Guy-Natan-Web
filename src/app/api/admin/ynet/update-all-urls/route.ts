import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for updating all YNET articles with correct URLs');
    
    // First, delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Create new articles with correct URLs
    const articlesData = [
      {
        title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
        publishedAt: new Date("2025-05-09"),
        link: "https://www.ynet.co.il/economy/article/byoq9vwlc",
        slug: "price-increases-" + Date.now(),
        isPublished: true
      },
      {
        title: "ישיבת המשקיעים של ברקשייר התאווי 2025: עידן באפט מגיע לסיום",
        publishedAt: new Date("2025-05-04"),
        link: "https://www.ynet.co.il/economy/article/skyuqbhv5",
        slug: "berkshire-meeting-" + Date.now(),
        isPublished: true
      },
      {
        title: "מאסק מזהיר: סין בונה יתרון אנרגיה מסוכן, וארה\"ב עלולה להישאר מאחור",
        publishedAt: new Date("2025-05-02"),
        link: "https://www.ynet.co.il/economy/article/hkbmjk11c",
        slug: "musk-warning-" + Date.now(),
        isPublished: true
      },
      {
        title: "הלוואות קבלן, תמונת מצב: על השינוי שעבר שוק הנדל\"ן בישראל בחמש השנים האחרונות",
        publishedAt: new Date("2025-04-27"),
        link: "https://www.ynet.co.il/economy/article/s1awlphwq",
        slug: "contractor-loans-" + Date.now(),
        isPublished: true
      },
      {
        title: "משבר מתקרב? מצב המימון לרכישת רכבים בישראל",
        publishedAt: new Date("2025-04-25"),
        link: "https://www.ynet.co.il/economy/article/rjl5cz00c",
        slug: "car-finance-" + Date.now(),
        isPublished: true
      },
      {
        title: "שקל 2.0: איך הכסף הדיגיטלי עומד לשנות את הארנק – ואת הבנק",
        publishedAt: new Date("2025-04-18"),
        link: "https://www.ynet.co.il/economy/article/b1q00fupjh",
        slug: "digital-shekel-" + Date.now(),
        isPublished: true
      }
    ];
    
    // Add all the articles to the database
    const savedArticles = await YnetArticle.create(articlesData);
    
    console.log(`Added ${savedArticles.length} YNET articles with correct URLs`);
    
    return NextResponse.json({
      success: true,
      message: `Added ${savedArticles.length} YNET articles with correct URLs`,
      articles: savedArticles
    });
  } catch (error) {
    console.error('Error updating YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update YNET articles', error: String(error) },
      { status: 500 }
    );
  }
} 