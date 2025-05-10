import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import slugify from 'slugify';

// This API endpoint will add a test YNET article
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding a test YNET article');
    
    // Create a test article that matches the design in the screenshot
    const article = {
      title: "חדשות הטכנולוגיה: פיתוחים חדשים בתחום הבינה המלאכותית",
      publishedAt: new Date("2025-05-10"),
      link: "https://www.ynet.co.il/capital/article/rkxnoxrggx", // Real YNET article link
      slug: slugify("חדשות-הטכנולוגיה-פיתוחים-חדשים-בתחום-הבינה-המלאכותית", { lower: true, strict: true }) + '-' + Date.now(),
      isPublished: true
    };
    
    // Add the article
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Added test YNET article:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Added test YNET article',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error adding test YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add test YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 