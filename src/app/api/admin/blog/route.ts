import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import '@/models/FinancialTerm'; // Import to ensure model is registered

// Get all blog posts for admin
export async function GET() {
  try {
    await dbConnect();
    
    const blogPosts = await BlogPost.find({})
      .populate({ path: 'relatedTerms', strictPopulate: false })
      .sort({ createdAt: -1 })
      .lean();
    
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
    
    // Handle slug creation - always auto-generate based on title
    let slugToUse = '';
    
    // Generate from title if available, otherwise use timestamp
    if (data.title && data.title.trim()) {
      slugToUse = data.title
        .toLowerCase()
        .replace(/[^\w\s-]/gi, '') // Remove special chars except hyphens
        .replace(/\s+/g, '-')      // Replace spaces with dashes
        .replace(/-+/g, '-')       // Replace multiple hyphens with a single one
        .replace(/^-|-$/g, '');    // Trim leading/trailing hyphens
    }
    
    // If slug is empty after processing, use a generic name
    if (!slugToUse || slugToUse === '-' || slugToUse.length < 3) {
      slugToUse = `post`;
    }
    
    // Always add a timestamp to ensure uniqueness
    const timestamp = Date.now();
    data.slug = `${slugToUse}-${timestamp}`;
    
    console.log(`Generated slug: ${data.slug} for title: "${data.title}"`);
    
    // Set published date if published immediately
    if (data.isPublished) {
      data.publishedAt = new Date();
      // Clear scheduled date if published immediately
      data.scheduledPublishDate = null;
      console.log(`Post will be published immediately`);
    } else if (data.scheduledPublishDate) {
      // Ensure scheduledPublishDate is properly formatted
      data.scheduledPublishDate = new Date(data.scheduledPublishDate);
      console.log(`Post scheduled for: ${data.scheduledPublishDate.toISOString()}`);
      
      // Validate the date is in the future
      const now = new Date();
      if (data.scheduledPublishDate <= now) {
        return NextResponse.json(
          { success: false, message: 'Scheduled publish date must be in the future' },
          { status: 400 }
        );
      }
    }
    
    console.log(`Creating blog post with title: "${data.title}"`);
    const blogPost = await BlogPost.create(data);
    console.log(`Blog post created with ID: ${blogPost._id}`);
    
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