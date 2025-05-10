// This module sets up automatic checking for scheduled blog posts
// It can be imported in server components/API routes to start the interval

import { NextRequest } from 'next/server';

let isSchedulerRunning = false;
let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Start the scheduled publishing checker that runs on an interval
 * @param intervalMs How often to check for posts (default: 60000ms = 1 minute)
 */
export function startScheduledPublishingChecker(intervalMs = 60000) {
  // Only start if not already running
  if (isSchedulerRunning) {
    console.log('Scheduled publishing checker is already running');
    return;
  }

  console.log(`Starting scheduled publishing checker to run every ${intervalMs}ms`);
  
  // Set up interval to check for posts to publish
  schedulerInterval = setInterval(async () => {
    try {
      console.log('Running scheduled publishing check...');
      
      // Instead of using fetch, directly import and call the route handler
      // This avoids networking issues in development
      const { POST } = await import('@/app/api/admin/blog/publish-scheduled/route');
      const result = await POST(new NextRequest('https://example.com'));
      const data = await result.json();
      
      if (data.published > 0) {
        console.log(`Published ${data.published} scheduled posts automatically`);
      } else {
        console.log('No scheduled posts to publish at this time');
      }
    } catch (error) {
      console.error('Error in scheduled publishing checker:', error);
    }
  }, intervalMs);
  
  isSchedulerRunning = true;
}

/**
 * Stop the scheduled publishing checker
 */
export function stopScheduledPublishingChecker() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    isSchedulerRunning = false;
    console.log('Stopped scheduled publishing checker');
  }
}

// For Node.js environments, handle cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('exit', () => {
    stopScheduledPublishingChecker();
  });
  
  // Capture Ctrl+C
  process.on('SIGINT', () => {
    console.log('Received SIGINT, cleaning up...');
    stopScheduledPublishingChecker();
    process.exit(0);
  });
} 