import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';

// Get all blog posts
export async function GET() {
  try {
    await dbConnect();
    
    const blogPosts = await BlogPost.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // Convert to plain JavaScript objects
    
    return NextResponse.json(blogPosts, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts', error: String(error) },
      { status: 500 }
    );
  }
}

// Create a new blog post
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Create a unique slug if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')  // Remove special chars
        .replace(/\s+/g, '-');     // Replace spaces with dashes
      
      // Check if slug already exists
      const existingSlug = await BlogPost.findOne({ slug: data.slug });
      if (existingSlug) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }
    
    // Set published date if published
    if (data.isPublished) {
      data.publishedAt = new Date();
    }
    
    const blogPost = await BlogPost.create(data);
    
    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post', error: String(error) },
      { status: 500 }
    );
  }
} 