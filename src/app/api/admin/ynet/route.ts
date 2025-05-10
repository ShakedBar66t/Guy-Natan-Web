import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';
import { verifyTokenWithClaims } from '@/lib/auth';

// GET - Fetch all YNET articles
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    
    // Parse limit if provided
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    // Build query
    let query = YnetArticle.find()
      .sort({ publishDate: -1 }); // Sort by publish date, newest first
    
    // Apply limit if specified
    if (limit && !isNaN(limit)) {
      query = query.limit(limit);
    }
    
    const articles = await query.lean(); // Convert to plain JavaScript objects
    
    console.log(`Fetched ${articles.length} YNET articles`);
    
    return NextResponse.json({
      articles,
      total: articles.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching YNET articles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch YNET articles', error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Create new YNET article
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { isAdmin } = await verifyTokenWithClaims(token);
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin privileges required' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    const data = await request.json();
    
    // Create a new article
    const article = await YnetArticle.create(data);
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 