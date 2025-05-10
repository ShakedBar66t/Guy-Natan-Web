import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all YNET articles
    const articles = await YnetArticle.find({}).lean();
    
    console.log('Retrieved all YNET articles for URL checking:', articles.length);
    
    // Examine and fix the URLs
    const fixedUrls = [];
    let fixedCount = 0;
    
    for (const article of articles) {
      const currentUrl = article.link;
      
      // Check if URL is a real YNET article URL
      const isValidUrl = currentUrl.includes('ynet.co.il/') && 
        (currentUrl.includes('/article/') || currentUrl.includes('/articles/'));
      
      fixedUrls.push({
        id: article._id,
        title: article.title,
        currentUrl,
        isValid: isValidUrl
      });
      
      if (!isValidUrl) {
        console.log(`Invalid URL found: ${currentUrl} for article: ${article.title}`);
      }
    }
    
    return NextResponse.json({
      articles: fixedUrls,
      total: articles.length,
      invalidCount: fixedUrls.filter(a => !a.isValid).length
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking YNET article URLs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check YNET article URLs', error: String(error) },
      { status: 500 }
    );
  }
} 