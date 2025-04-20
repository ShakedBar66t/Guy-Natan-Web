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
    
    // Ensure relatedTerms is an array
    if (!data.relatedTerms) {
      data.relatedTerms = [];
    }
    
    // Handle slug creation/validation - ensure it's never empty or just "-"
    let slugToUse = '';
    
    if (!data.slug || data.slug.trim() === '-' || data.slug.trim() === '') {
      // If title is empty or only has special characters, use a timestamp
      const titleForSlug = data.title && data.title.trim() ? data.title : `post-${Date.now()}`;
      
      slugToUse = titleForSlug
        .toLowerCase()
        .replace(/[^\w\s-]/gi, '') // Remove special chars except hyphens
        .replace(/\s+/g, '-')      // Replace spaces with dashes
        .replace(/-+/g, '-')       // Replace multiple hyphens with a single one
        .replace(/^-|-$/g, '');    // Trim leading/trailing hyphens
    } else {
      slugToUse = data.slug.trim();
    }
    
    // If slug is empty or just "-" after all replacements, use a timestamp
    if (!slugToUse || slugToUse === '-' || slugToUse === '') {
      slugToUse = `post-${Date.now()}`;
    }
    
    // Always add a timestamp to ensure uniqueness
    data.slug = `${slugToUse}-${Date.now()}`;
    
    // Set published date if published
    if (data.isPublished) {
      data.publishedAt = new Date();
    }
    
    const blogPost = await BlogPost.create(data);
    
    // Populate the related terms in the response
    const populatedBlogPost = await BlogPost.findById(blogPost._id)
      .populate({ path: 'relatedTerms', strictPopulate: false })
      .lean();
    
    return NextResponse.json(populatedBlogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post', error: String(error) },
      { status: 500 }
    );
  }
} 