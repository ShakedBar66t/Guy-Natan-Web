import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';

// This is a debugging helper endpoint that checks for scheduled posts 
// but doesn't actually publish them

export async function GET() {
  try {
    await dbConnect();
    
    const now = new Date();
    console.log(`Checking scheduled posts at ${now.toISOString()} (${now.toString()})`);
    
    // Find all blog posts with scheduledPublishDate
    const allScheduledPosts = await BlogPost.find({
      scheduledPublishDate: { $ne: null }
    }).sort({ scheduledPublishDate: 1 });
    
    console.log(`Found ${allScheduledPosts.length} posts with scheduled dates`);
    
    // Print detailed info about each scheduled post
    allScheduledPosts.forEach(post => {
      const scheduledDate = new Date(post.scheduledPublishDate);
      console.log(`- Post "${post.title}" (${post._id})`);
      console.log(`  Scheduled for: ${scheduledDate.toISOString()} (${scheduledDate.toString()})`);
      console.log(`  Is published: ${post.isPublished}`);
      console.log(`  Should publish: ${scheduledDate <= now && !post.isPublished}`);
    });
    
    // Find posts due to be published
    const duePosts = await BlogPost.find({
      isPublished: false,
      scheduledPublishDate: { 
        $lte: now,
        $ne: null 
      }
    });
    
    console.log(`Found ${duePosts.length} posts due for publishing`);
    
    if (duePosts.length > 0) {
      duePosts.forEach(post => {
        const scheduledDate = new Date(post.scheduledPublishDate);
        console.log(`Post due for publishing: "${post.title}" (ID: ${post._id})`);
        console.log(`  Scheduled time: ${scheduledDate.toISOString()} (${scheduledDate.toString()})`);
        console.log(`  Current time: ${now.toISOString()} (${now.toString()})`);
        console.log(`  Time difference: ${(now.getTime() - scheduledDate.getTime()) / 1000} seconds`);
      });
    }
    
    // Format the results for the response
    const formattedScheduled = allScheduledPosts.map(post => {
      const scheduledDate = new Date(post.scheduledPublishDate);
      return {
        id: post._id,
        title: post.title,
        isPublished: post.isPublished,
        scheduledDate: post.scheduledPublishDate,
        scheduledDateString: scheduledDate.toString(),
        isPastDue: scheduledDate <= now && !post.isPublished,
        timeUntilPublish: scheduledDate.getTime() - now.getTime()
      };
    });
    
    const formattedDue = duePosts.map(post => {
      const scheduledDate = new Date(post.scheduledPublishDate);
      return {
        id: post._id,
        title: post.title,
        scheduledDate: post.scheduledPublishDate,
        scheduledDateString: scheduledDate.toString(),
        timePastDue: now.getTime() - scheduledDate.getTime()
      };
    });
    
    return NextResponse.json({
      success: true,
      currentTime: now.toISOString(),
      currentTimeString: now.toString(),
      scheduledPosts: formattedScheduled,
      dueForPublishing: formattedDue
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking scheduled posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check scheduled posts', error: String(error) },
      { status: 500 }
    );
  }
} 