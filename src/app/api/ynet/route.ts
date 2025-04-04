import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import YnetArticle, { IYnetArticle } from '@/models/YnetArticle';

// GET all YNET articles
export async function GET(req: NextRequest) {
  try {
    console.log('API: Attempting to connect to MongoDB...');
    await connectToDatabase();
    console.log('API: MongoDB connection successful');
    
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const isPublished = searchParams.get('isPublished') === 'true' ? true : undefined;
    const slug = searchParams.get('slug');
    
    // Build query
    const query: any = {};
    
    if (isPublished !== undefined) query.isPublished = isPublished;
    if (slug) query.slug = slug;
    
    console.log('API: Query parameters:', { query, limit });
    
    console.log('API: Executing YnetArticle.find()...');
    const ynetArticles = await YnetArticle.find(query)
      .sort({ date: -1 })
      .limit(limit);
    
    console.log(`API: Found ${ynetArticles.length} articles`);
    return NextResponse.json(ynetArticles);
  } catch (error) {
    console.error('Error fetching YNET articles:', error);
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to fetch YNET articles', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST a new YNET article
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    // Add current date if not provided
    if (!body.date) {
      // Format date as DD.MM.YYYY
      const now = new Date();
      body.date = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    } else {
      // If date is provided in ISO format (YYYY-MM-DD), convert to DD.MM.YYYY
      if (body.date.includes('-')) {
        const dateParts = body.date.split('-');
        body.date = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
      }
    }
    
    // Create the slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // Use originalLink as externalLink if provided
    if (body.originalLink && !body.externalLink) {
      body.externalLink = body.originalLink;
      // We keep the originalLink property for use in the frontend
    }
    
    // Set content and excerpt to empty strings if they're not provided
    if (!body.content) body.content = '';
    if (!body.excerpt) body.excerpt = '';
    
    const ynetArticle = await YnetArticle.create(body);
    return NextResponse.json(ynetArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating YNET article:', error);
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to create YNET article', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 