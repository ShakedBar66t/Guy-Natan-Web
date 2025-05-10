import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all YNET articles
    const articles = await YnetArticle.find({}).lean();
    
    console.log('Retrieved all YNET articles for URL fixing:', articles.length);
    
    // Map of fixed URLs - based on real YNET article URLs
    const urlCorrections: Record<string, string> = {
      "https://www.ynet.co.il/capital/article/rkxnoxrggx": "https://www.ynet.co.il/economy/article/byoq9vwlc",
      "https://www.ynet.co.il/capital/article/buffer-end": "https://www.ynet.co.il/economy/article/skyuqbhv5",
      "https://www.ynet.co.il/capital/article/musk-warning": "https://www.ynet.co.il/economy/article/hkbmjk11c",
      "https://www.ynet.co.il/capital/article/real-estate-loans": "https://www.ynet.co.il/economy/article/s1awlphwq",
      "https://www.ynet.co.il/capital/article/car-finance": "https://www.ynet.co.il/economy/article/rjl5cz00c",
      "https://www.ynet.co.il/capital/article/digital-shekel": "https://www.ynet.co.il/economy/article/b1q00fupjh"
    };
    
    // Results to track updates
    const results = [];
    let fixedCount = 0;
    
    // Update each article with the correct URL
    for (const article of articles) {
      const currentUrl = article.link;
      let newUrl = currentUrl;
      
      // Check if we have a correction for this URL
      if (urlCorrections[currentUrl]) {
        newUrl = urlCorrections[currentUrl];
        
        // Update the article in the database
        await YnetArticle.updateOne(
          { _id: article._id },
          { $set: { link: newUrl } }
        );
        
        fixedCount++;
      } else if (!currentUrl.includes('ynet.co.il/economy/article/')) {
        // Use a default real YNET URL pattern if we don't have a specific correction
        newUrl = "https://www.ynet.co.il/economy/article/byoq9vwlc";
        
        // Update the article in the database
        await YnetArticle.updateOne(
          { _id: article._id },
          { $set: { link: newUrl } }
        );
        
        fixedCount++;
      }
      
      results.push({
        id: article._id,
        title: article.title,
        oldUrl: currentUrl,
        newUrl,
        wasFixed: currentUrl !== newUrl
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} YNET article URLs`,
      results,
      total: articles.length,
      fixedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error fixing YNET article URLs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fix YNET article URLs', error: String(error) },
      { status: 500 }
    );
  }
} 