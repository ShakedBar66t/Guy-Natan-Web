import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    // Get total count of Ynet articles
    const ynetArticles = await YnetArticle.countDocuments();
    
    // Get count of articles published in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentArticles = await YnetArticle.countDocuments({
      publishedAt: { $gte: oneMonthAgo }
    });
    
    return NextResponse.json(
      { ynetArticles, recentArticles },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching Ynet stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Ynet statistics', error: String(error) },
      { status: 500 }
    );
  }
} 