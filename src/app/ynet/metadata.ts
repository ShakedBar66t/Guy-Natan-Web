import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מאמרי YNET | גיא נתן',
  description: 'מאמרים וכתבות של גיא נתן שפורסמו ב-YNET. תובנות ועצות מקצועיות בנושאי כלכלה, השקעות ותכנון פיננסי.',
  openGraph: {
    title: 'מאמרי YNET | גיא נתן',
    description: 'מאמרים וכתבות של גיא נתן שפורסמו ב-YNET. תובנות ועצות מקצועיות בנושאי כלכלה, השקעות ותכנון פיננסי.',
    url: 'https://guy-natan.vercel.app/ynet',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
        width: 800,
        height: 600,
        alt: 'מאמרי YNET - גיא נתן',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מאמרי YNET | גיא נתן',
    description: 'מאמרים וכתבות של גיא נתן שפורסמו ב-YNET. תובנות ועצות מקצועיות בנושאי כלכלה והשקעות.',
    images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
  },
};

export default metadata; 