import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding single Guy Natan YNET article');
    
    // First, delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Create a single article with Guy Natan's title
    // Article links directly to Guy Natan's website
    const article = {
      title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
      publishedAt: new Date("2025-05-09"),
      link: "https://guynatan.com/%d7%91%d7%aa%d7%a7%d7%a9%d7%95%d7%a8%d7%aa/",
      slug: "price-increases-" + Date.now(),
      isPublished: true
    };
    
    // Add the article to the database
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Added a single Guy Natan YNET article:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Added a single Guy Natan YNET article',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error adding Guy Natan YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add Guy Natan YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 