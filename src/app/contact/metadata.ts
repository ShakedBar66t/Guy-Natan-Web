import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'צור קשר | גיא נתן',
  description: 'צרו קשר עם גיא נתן לייעוץ פיננסי, ליווי בהשקעות או כל שאלה אחרת. מלאו את הטופס ונחזור אליכם בהקדם.',
  openGraph: {
    title: 'צור קשר | גיא נתן',
    description: 'צרו קשר עם גיא נתן לייעוץ פיננסי, ליווי בהשקעות או כל שאלה אחרת. מלאו את הטופס ונחזור אליכם בהקדם.',
    url: 'https://guy-natan.vercel.app/contact',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
        width: 800,
        height: 600,
        alt: 'צור קשר - גיא נתן',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'צור קשר | גיא נתן',
    description: 'צרו קשר עם גיא נתן לייעוץ פיננסי, ליווי בהשקעות או כל שאלה אחרת.',
    images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
  },
};

export default metadata; 