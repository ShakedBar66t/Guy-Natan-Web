import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding Guy Natan\'s YNET articles');
    
    // First, delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Create articles with titles from Guy Natan's website
    // All articles link directly to Guy Natan's website where all these articles are listed
    const baseUrl = "https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/";
    
    const articlesData = [
      {
        title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
        publishedAt: new Date("2025-05-09"),
        link: baseUrl,
        slug: "price-increases-" + Date.now(),
        isPublished: true
      },
      {
        title: "ישיבת המשקיעים של ברקשייר התאווי 2025: עידן באפט מגיע לסיום",
        publishedAt: new Date("2025-05-04"),
        link: baseUrl,
        slug: "berkshire-meeting-" + Date.now(),
        isPublished: true
      },
      {
        title: "מאסק מזהיר: סין בונה יתרון אנרגיה מסוכן, וארה\"ב עלולה להישאר מאחור",
        publishedAt: new Date("2025-05-02"),
        link: baseUrl,
        slug: "musk-warning-" + Date.now(),
        isPublished: true
      },
      {
        title: "הלוואות קבלן, תמונת מצב: על השינוי שעבר שוק הנדל\"ן בישראל בחמש השנים האחרונות",
        publishedAt: new Date("2025-04-27"),
        link: baseUrl,
        slug: "contractor-loans-" + Date.now(),
        isPublished: true
      },
      {
        title: "משבר מתקרב? מצב המימון לרכישת רכבים בישראל",
        publishedAt: new Date("2025-04-25"),
        link: baseUrl,
        slug: "car-finance-" + Date.now(),
        isPublished: true
      },
      {
        title: "שקל 2.0: איך הכסף הדיגיטלי עומד לשנות את הארנק – ואת הבנק",
        publishedAt: new Date("2025-04-18"),
        link: baseUrl,
        slug: "digital-shekel-" + Date.now(),
        isPublished: true
      }
    ];
    
    // Add all the articles to the database
    const savedArticles = await YnetArticle.create(articlesData);
    
    console.log(`Added ${savedArticles.length} Guy Natan's YNET articles`);
    
    return NextResponse.json({
      success: true,
      message: `Added ${savedArticles.length} Guy Natan's YNET articles with links to Guy Natan's website`,
      articles: savedArticles
    });
  } catch (error) {
    console.error('Error adding Guy Natan\'s YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add Guy Natan\'s YNET articles', error: String(error) },
      { status: 500 }
    );
  }
} 