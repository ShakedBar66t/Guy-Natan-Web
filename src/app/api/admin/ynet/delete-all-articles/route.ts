import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB for deleting all YNET articles');
    
    // Delete all existing articles
    const deleteResult = await YnetArticle.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} YNET articles from the database`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} YNET articles`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Error deleting YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete YNET articles', error: String(error) },
      { status: 500 }
    );
  }
} 