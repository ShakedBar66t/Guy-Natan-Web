import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

// This API endpoint will update all YNET articles to have isPublished=true
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for fixing YNET articles');
    
    // First, get count of all articles
    const allArticles = await YnetArticle.find({}).lean();
    console.log(`Found ${allArticles.length} total YNET articles before update`);
    
    // Log sample article to see its structure
    if (allArticles.length > 0) {
      console.log('Sample article:', JSON.stringify(allArticles[0], null, 2));
    }
    
    // Update all articles to set isPublished=true
    const updateResult = await YnetArticle.updateMany(
      {}, // match all documents
      { $set: { isPublished: true } },
      { upsert: false }
    );
    
    console.log('Update result:', updateResult);
    
    // Get count of published articles after update
    const publishedArticles = await YnetArticle.find({ isPublished: true }).lean();
    console.log(`Found ${publishedArticles.length} published YNET articles after update`);
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updateResult.modifiedCount} YNET articles, now have ${publishedArticles.length} published`,
      totalArticles: allArticles.length,
      publishedArticles: publishedArticles.length,
      updateResult
    });
  } catch (error) {
    console.error('Error fixing YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fix YNET articles', error: String(error) },
      { status: 500 }
    );
  }
} 