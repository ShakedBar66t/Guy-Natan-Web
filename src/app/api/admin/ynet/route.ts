import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import YnetArticle from '@/models/YnetArticle';

// Get all Ynet articles
export async function GET() {
  try {
    await dbConnect();
    
    const articles = await YnetArticle.find({})
      .sort({ publishedAt: -1 }) // Sort by newest first
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

// Create a new Ynet article
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const data = await request.json();
    console.log('Creating Ynet article with data:', data);
    
    // Set published date if not provided
    if (!data.publishedAt) {
      data.publishedAt = new Date();
    }
    
    // Ensure we have a slug - generate from title as fallback
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\sא-ת]/g, '')
        .replace(/\s+/g, '-')
        .trim();
        
      // Add timestamp to ensure uniqueness
      data.slug = `${data.slug}-${Date.now()}`;
    }
    
    // Check if slug already exists
    const existingArticle = await YnetArticle.findOne({ slug: data.slug });
    
    // If slug exists, make it unique by adding a timestamp
    if (existingArticle) {
      data.slug = `${data.slug}-${Date.now()}`;
    }
    
    const article = await YnetArticle.create(data);
    console.log('Ynet article created successfully:', article);
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating Ynet article. Full error:', error);
    
    // Check if it's a validation error
    if (error instanceof Error && 'errors' in (error as any)) {
      const validationErrors = Object.values((error as any).errors || {})
        .map((err: any) => err.message)
        .join(', ');
      
      console.error('Validation errors:', validationErrors);
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to create Ynet article due to validation errors', 
          error: validationErrors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create Ynet article', error: String(error) },
      { status: 500 }
    );
  }
} 