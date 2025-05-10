import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'פודקאסט | גיא נתן',
  description: 'האזינו לפודקאסט של גיא נתן - שיחות מעמיקות על כלכלה, השקעות, והחלטות פיננסיות חכמות שיוכלו לשנות את החיים הכלכליים שלכם.',
  openGraph: {
    title: 'פודקאסט | גיא נתן',
    description: 'האזינו לפודקאסט של גיא נתן - שיחות מעמיקות על כלכלה, השקעות, והחלטות פיננסיות חכמות שיוכלו לשנות את החיים הכלכליים שלכם.',
    url: 'https://guy-natan.vercel.app/podcast',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
        width: 800,
        height: 600,
        alt: 'פודקאסט - גיא נתן',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'פודקאסט | גיא נתן',
    description: 'האזינו לפודקאסט של גיא נתן - שיחות מעמיקות על כלכלה, השקעות, והחלטות פיננסיות חכמות.',
    images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
  },
};

export default metadata; 