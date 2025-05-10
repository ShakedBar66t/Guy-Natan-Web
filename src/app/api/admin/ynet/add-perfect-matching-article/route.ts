import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import slugify from 'slugify';

// This API endpoint will add an article exactly matching the latest screenshot
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding a perfectly matching YNET article');
    
    // Create an article that perfectly matches the latest screenshot
    const article = {
      title: "חדשות הטכנולוגיה: פיתוחים חדשים בתחום הבינה המלאכותית",
      publishedAt: new Date("2025-05-10"),
      link: "https://www.ynet.co.il/capital/article/rkxnoxrggx",
      slug: "perfect-match-" + Date.now(),
      isPublished: true
    };
    
    // Add the article
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Added perfectly matching YNET article:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Added perfectly matching YNET article',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error adding perfectly matching YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add perfectly matching YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 