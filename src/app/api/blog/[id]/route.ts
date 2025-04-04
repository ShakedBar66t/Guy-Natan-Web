import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

interface IParams {
  params: {
    id: string;
  };
}

// GET a single blog post by ID
export async function GET(req: NextRequest, { params }: IParams) {
  try {
    await connectToDatabase();
    
    const blogPost = await BlogPost.findById(params.id);
    
    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT (update) a blog post by ID
export async function PUT(req: NextRequest, { params }: IParams) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBlogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedBlogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE a blog post by ID
export async function DELETE(req: NextRequest, { params }: IParams) {
  try {
    await connectToDatabase();
    
    const deletedBlogPost = await BlogPost.findByIdAndDelete(params.id);
    
    if (!deletedBlogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 