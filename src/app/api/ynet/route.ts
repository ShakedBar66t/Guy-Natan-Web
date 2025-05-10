import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Connect to MongoDB
    console.log('Connected to MongoDB for YNET articles');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    
    // Parse limit if provided
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    // Debug: First check all articles
    const allArticles = await YnetArticle.find({}).lean();
    console.log(`Found ${allArticles.length} total YNET articles in database`);
    
    // Log first article if exists for debugging
    if (allArticles.length > 0) {
      console.log('Sample article:', JSON.stringify(allArticles[0], null, 2));
    }
    
    // Build query - only published articles
    let query = YnetArticle.find({ isPublished: true })
      .sort({ publishedAt: -1 }); // Sort by publish date, newest first
    
    // Apply limit if specified
    if (limit && !isNaN(limit)) {
      query = query.limit(limit);
    }
    
    // Execute query
    const articles = await query.lean(); // Convert to plain JavaScript objects
    
    console.log(`Fetched ${articles.length} published YNET articles`);
    
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

// TEMPORARY: Allow public POST for testing
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Creating test YNET article...');
    const data = await request.json();
    
    // Create slug if not provided
    if (!data.slug) {
      const timestamp = Date.now();
      data.slug = `${data.title.toLowerCase().replace(/[^\w\sא-ת]/g, '').replace(/\s+/g, '-')}-${timestamp}`;
    }
    
    // Convert publishDate to publishedAt if provided
    if (data.publishDate && !data.publishedAt) {
      data.publishedAt = data.publishDate;
      delete data.publishDate;
    }
    
    // Ensure isPublished is set to true
    data.isPublished = true;
    
    // Create a new article
    const article = await YnetArticle.create(data);
    console.log('YNET article created:', article);
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating YNET article:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create YNET article', error: String(error) },
      { status: 500 }
    );
  }
} 