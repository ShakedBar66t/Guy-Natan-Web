// scheduler.js - A simple script to handle scheduled publishing
const { exec } = require('child_process');
const http = require('http');

console.log('Starting scheduled publishing checker...');
console.log('Ctrl+C to stop');

// Function to call the publish-scheduled endpoint
function checkScheduledPosts() {
  console.log(`\n[${new Date().toISOString()}] Checking for scheduled posts...`);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/blog/publish-scheduled',
    method: 'POST',
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.published > 0) {
          console.log(`✅ Published ${response.published} posts!`);
          console.log(`Posts: ${JSON.stringify(response.posts, null, 2)}`);
        } else {
          console.log('✓ No posts to publish at this time');
        }
      } catch (e) {
        console.error('Failed to parse response:', e);
        console.log('Raw response:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('Error checking scheduled posts:', error.message);
  });
  
  req.end();
}

// Check immediately on startup
checkScheduledPosts();

// Then check every 15 seconds
setInterval(checkScheduledPosts, 15000);

// Keep the script running
console.log('Scheduler is running. Press Ctrl+C to stop.'); 