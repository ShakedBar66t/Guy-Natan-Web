import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import slugify from 'slugify';

// This API endpoint will add an article matching the screenshot exactly
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding a perfectly matched YNET article');
    
    // Create a test article that exactly matches the design in the screenshot
    const article = {
      title: "חדשות הטכנולוגיה: פיתוחים חדשים בתחום הבינה המלאכותית",
      publishedAt: new Date("2025-05-10"),
      link: "https://www.ynet.co.il/capital/article/rkxnoxrggx",
      slug: slugify("חדשות-הטכנולוגיה-פיתוחים-חדשים-בתחום-הבינה-המלאכותית", { lower: true, strict: true }) + '-' + Date.now(),
      isPublished: true
    };
    
    // Add the article
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Added exactly matched YNET article:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Added exactly matched YNET article',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error adding exactly matched YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add exactly matched YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 