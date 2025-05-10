import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import slugify from 'slugify';

// This API endpoint will add an article with the correct title
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for adding article with correct title');
    
    // Create an article with the correct title from customer's example
    const article = {
      title: "גל ההתייקרויות בישראל: הלחץ גובר מכל כיוון",
      publishedAt: new Date("2025-05-09"),
      link: "https://www.ynet.co.il/capital/article/rkxnoxrggx",
      slug: "correct-title-" + Date.now(),
      isPublished: true
    };
    
    // Add the article
    const savedArticle = await YnetArticle.create(article);
    
    console.log('Added article with correct title:', savedArticle);
    
    return NextResponse.json({
      success: true,
      message: 'Added article with correct title',
      article: savedArticle
    });
  } catch (error) {
    console.error('Error adding article with correct title:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add article with correct title', error: String(error) },
      { status: 500 }
    );
  }
} 