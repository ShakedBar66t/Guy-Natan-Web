import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';

export async function GET() {
  try {
    await dbConnect();
    
    // Get total count of blog posts
    const blogPosts = await BlogPost.countDocuments();
    
    // Get count of published posts
    const publishedPosts = await BlogPost.countDocuments({ isPublished: true });
    
    // Get count of draft posts
    const draftPosts = await BlogPost.countDocuments({ isPublished: false });
    
    return NextResponse.json(
      { blogPosts, publishedPosts, draftPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog statistics', error: String(error) },
      { status: 500 }
    );
  }
} 