import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

// This API endpoint will delete all YNET articles
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for deleting all YNET articles');
    
    // First, get count of all articles
    const allArticles = await YnetArticle.find({}).lean();
    console.log(`Found ${allArticles.length} total YNET articles before deletion`);
    
    // Delete all articles
    const deleteResult = await YnetArticle.deleteMany({});
    
    console.log(`Deleted ${deleteResult.deletedCount} YNET articles`);
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${deleteResult.deletedCount} YNET articles`,
      deleteResult
    });
  } catch (error) {
    console.error('Error deleting YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete YNET articles', error: String(error) },
      { status: 500 }
    );
  }
} 