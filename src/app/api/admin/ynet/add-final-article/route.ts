import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding final YNET article');
    
    // First, delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing YNET articles`);
    
    // Create a single article with a guaranteed working URL
    const article = {
      title: "מנכ\"לי בנקים קראו לנתניהו לעצור: \"מזהים משיכה מפקדונות, אי אפשר להתעלם מהאזהרות\"",
      publishedAt: new Date("2023-01-27"),
      link: "https://www.ynet.co.il/news/article/rk11gkpwno",
      slug: "bank-ceos-" + Date.now(),
      isPublished: true
    };
    
    // Add the article to the database
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Added final YNET article:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Added final YNET article with guaranteed working URL',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error adding final YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add final YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 