# Guy Natan Financial Blog

This is the codebase for Guy Natan's financial blog, built with Next.js and MongoDB.

## Features

- Blog posts with rich content editing
- Financial glossary/dictionary
- Admin dashboard for content management
- Scheduled post publishing
- SEO optimization
- User-friendly interface

## Scheduled Publishing

The blog supports scheduled publishing of posts. Posts can be scheduled with a specific date and time for automatic publishing.

### Automatic Publishing (Vercel Deployment)

When the site is deployed on Vercel, scheduled posts are automatically published using Vercel Cron Jobs. The system checks for due posts every minute and publishes them without requiring any manual intervention.

The cron job is configured in `vercel.json` with the following settings:
```json
{
  "crons": [
    {
      "path": "/api/admin/blog/publish-scheduled",
      "schedule": "* * * * *"
    }
  ]
}
```

This setup means:
- The publishing endpoint will be called every minute
- Posts scheduled for publication will be automatically published when their scheduled time arrives
- No manual action is required

### Manual Publishing Check

You can also manually check for and publish any due scheduled posts from the admin dashboard by clicking the "בדוק פרסומים מתוזמנים" (Check Scheduled Posts) button. This is useful for debugging or if you need to force a check outside the automated schedule.

### Local Development Auto-Publishing

In development mode, the application automatically starts a scheduler that checks for scheduled posts every 30 seconds using a built-in timer. This allows testing of the scheduled publishing feature locally without needing to set up external cron jobs.

The auto-publishing functionality is implemented in:
- `src/lib/scheduledPublishing.ts` - Contains the scheduler logic
- `src/app/api/admin/blog/publish-scheduled/route.ts` - Starts the scheduler in development environments

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env.local`
4. Run the development server with `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
