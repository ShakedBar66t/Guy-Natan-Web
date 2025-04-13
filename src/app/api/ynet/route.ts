import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET() {
  try {
    await dbConnect();
    
    const articles = await YnetArticle.find({})
      .sort({ publishedAt: -1 }) // Sort by publish date, newest first
      .limit(10) // Get latest 10 articles
      .lean(); // Convert to plain JavaScript objects
    
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error('Error fetching Ynet articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Ynet articles', error: String(error) },
      { status: 500 }
    );
  }
} 