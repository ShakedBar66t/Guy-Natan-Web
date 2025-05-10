import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import '@/models/FinancialTerm'; // Import to ensure model is registered

// Get a single blog post by slug
export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    // In Next.js App Router, we access context.params directly
    // without destructuring to avoid the "params should be awaited" error
    const slug = context.params.slug;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug parameter is required' },
        { status: 400 }
      );
    }
    
    // Special case for 'new' slug which shouldn't be handled here
    if (slug === 'new') {
      return NextResponse.json(
        { success: false, message: 'Invalid slug: "new" is a reserved path' },
        { status: 404 }
      );
    }
    
    // Find the blog post by slug and ensure it's published
    const blogPost = await BlogPost.findOne({ 
      slug, 
      isPublished: true 
    }).populate({ path: 'relatedTerms', strictPopulate: false }).lean();
    
    if (!blogPost) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blogPost, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog post', error: String(error) },
      { status: 500 }
    );
  }
} 