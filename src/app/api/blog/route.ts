import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BlogPost, { IBlogPost } from '@/models/BlogPost';

// GET all blog posts or filter by query params
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const isPublished = searchParams.get('isPublished');
    const slug = searchParams.get('slug');
    
    // Build query
    const query: any = {};
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (isPublished !== null) {
      query.isPublished = isPublished === 'true' ? true : false;
    }
    if (slug) query.slug = slug;
    
    const blogPosts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
      
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST a new blog post
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    // Add current date if not provided
    if (!body.date) {
      body.date = new Date().toISOString();
    }
    
    // Create the slug if not provided
    if (!body.slug) {
      // Use the English characters and numbers from the title for the slug
      // For Hebrew titles, this might result in just numbers or very short slugs
      const baseSlug = body.title
        .toLowerCase()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start of text
        .replace(/-+$/, '');        // Trim - from end of text
      
      // If the slug is empty or very short (common with Hebrew titles), 
      // add a timestamp to make it unique
      body.slug = baseSlug.length < 3 
        ? `post-${Date.now()}` 
        : baseSlug;
    }
    
    console.log('Creating blog post with data:', body);
    
    const blogPost = await BlogPost.create(body);
    return NextResponse.json(blogPost, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: `Failed to create blog post: ${error.message}` },
      { status: 500 }
    );
  }
} 