import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';

// This route can be called by a cron job or a scheduled task
// It checks for any blog posts with scheduledPublishDate in the past
// and publishes them by setting isPublished to true and publishedAt to current time

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const now = new Date();
    console.log(`Running scheduled publishing check at ${now.toISOString()} (${now.toString()})`);
    
    // First log all scheduled posts for debugging
    const allScheduled = await BlogPost.find({
      scheduledPublishDate: { $ne: null }
    });
    
    console.log(`Total scheduled posts: ${allScheduled.length}`);
    allScheduled.forEach(post => {
      const scheduledDate = new Date(post.scheduledPublishDate);
      console.log(`- Post "${post.title}" (${post._id})`);
      console.log(`  Scheduled for: ${scheduledDate.toISOString()} (${scheduledDate.toString()})`);
      console.log(`  Is published: ${post.isPublished}`);
      console.log(`  Should publish: ${scheduledDate <= now && !post.isPublished}`);
      console.log(`  Time difference: ${(now.getTime() - scheduledDate.getTime()) / 1000} seconds`);
    });
    
    // Find all blog posts with scheduledPublishDate in the past and not yet published
    const postsToPublish = await BlogPost.find({
      isPublished: false,
      scheduledPublishDate: { 
        $lte: now, // Less than or equal to current time
        $ne: null  // Not null
      }
    });
    
    console.log(`Found ${postsToPublish.length} posts scheduled for publishing`);
    
    if (postsToPublish.length > 0) {
      // Log details of each post that will be published
      postsToPublish.forEach(post => {
        const scheduledDate = new Date(post.scheduledPublishDate);
        console.log(`Post ready for publishing: "${post.title}" (ID: ${post._id})`);
        console.log(`  Scheduled time: ${scheduledDate.toISOString()} (${scheduledDate.toString()})`);
        console.log(`  Current time: ${now.toISOString()} (${now.toString()})`);
        console.log(`  Time difference: ${(now.getTime() - scheduledDate.getTime()) / 1000} seconds`);
      });
      
      // Publish each post by updating its status and setting publishedAt
      for (const post of postsToPublish) {
        console.log(`Publishing post: "${post.title}" (ID: ${post._id})`);
        
        // Directly update in the database to ensure it's applied
        const result = await BlogPost.updateOne(
          { _id: post._id },
          { 
            $set: { 
              isPublished: true, 
              publishedAt: now 
            } 
          }
        );
        
        console.log(`Update result: ${JSON.stringify(result)}`);
      }
      
      // Return information about published posts
      const publishResults = postsToPublish.map(post => ({
        id: post._id,
        title: post.title,
        slug: post.slug,
        scheduledDate: post.scheduledPublishDate
      }));
      
      return NextResponse.json({
        success: true,
        message: `Published ${publishResults.length} scheduled posts`,
        published: publishResults.length,
        posts: publishResults,
        currentTime: now.toISOString()
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'No scheduled posts to publish at this time',
      published: 0,
      currentTime: now.toISOString(),
      currentTimeString: now.toString()
    }, { status: 200 });
  } catch (error) {
    console.error('Error publishing scheduled posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to publish scheduled posts', error: String(error) },
      { status: 500 }
    );
  }
}

// Allow GET requests for easier testing
export async function GET() {
  console.log('GET request received for publish-scheduled, running check now...');
  return POST(new NextRequest('https://example.com'));
}

// The auto-scheduler in development mode was causing issues.
// We've replaced it with a more reliable direct import approach in the publish-scheduled/route.ts file.
// To manually check right now, call:

// Direct check for debugging - execute this once at module load time in development
if (process.env.NODE_ENV === 'development') {
  console.log('Development mode detected - running immediate publish check on module load');
  POST(new NextRequest('https://example.com')).catch(err => {
    console.error('Failed to run initial publish check:', err);
  });
} 