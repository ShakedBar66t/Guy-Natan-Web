import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import slugify from 'slugify';

// This API endpoint will add an article exactly matching the screenshot
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding the screenshot YNET article');
    
    // Create an article that exactly matches the screenshot
    const article = {
      title: "חדשות הטכנולוגיה: פיתוחים חדשים בתחום הבינה המלאכותית",
      publishedAt: new Date("2025-05-10"),
      link: "https://www.ynet.co.il/capital/article/rkxnoxrggx",
      slug: "screenshot-article-" + Date.now(),
      isPublished: true
    };
    
    // Add the article
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Added screenshot YNET article:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Added screenshot YNET article',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error adding screenshot YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add screenshot YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 