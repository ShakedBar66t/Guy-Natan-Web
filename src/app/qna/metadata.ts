import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'שאלות ותשובות | גיא נתן',
  description: 'תשובות לשאלות נפוצות בנושאי השקעות, כלכלה, וניהול פיננסי. מידע מקצועי שיעזור לכם לקבל החלטות פיננסיות חכמות יותר.',
  openGraph: {
    title: 'שאלות ותשובות | גיא נתן',
    description: 'תשובות לשאלות נפוצות בנושאי השקעות, כלכלה, וניהול פיננסי. מידע מקצועי שיעזור לכם לקבל החלטות פיננסיות חכמות יותר.',
    url: 'https://guy-natan.vercel.app/qna',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
        width: 800,
        height: 600,
        alt: 'שאלות ותשובות - גיא נתן',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'שאלות ותשובות | גיא נתן',
    description: 'תשובות לשאלות נפוצות בנושאי השקעות, כלכלה, וניהול פיננסי.',
    images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
  },
};

export default metadata; 