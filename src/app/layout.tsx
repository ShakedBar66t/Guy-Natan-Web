// src/app/layout.tsx
import "@/app/globals.css";
import ClientLayout from "./client-layout";
import { Assistant } from "next/font/google";
import TradingViewTicker from "@/components/TradingViewTicker";

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "גיא נתן | ייעוץ פיננסי וליווי כלכלי",
  description: "האתר הרשמי של גיא נתן - ייעוץ וליווי פיננסי, עדכונים מעולם ההשקעות, מאמרים וידע כלכלי שיעזור לך לקבל החלטות פיננסיות חכמות יותר.",
  icons: {
    icon: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
    apple: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
  },
  metadataBase: new URL('https://guy-natan.vercel.app'),
  openGraph: {
    title: 'גיא נתן | ייעוץ פיננסי וליווי כלכלי',
    description: 'האתר הרשמי של גיא נתן - ייעוץ וליווי פיננסי, עדכונים מעולם ההשקעות, מאמרים וידע כלכלי שיעזור לך לקבל החלטות פיננסיות חכמות יותר.',
    url: 'https://guy-natan.vercel.app',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png',
        width: 800,
        height: 600,
        alt: 'גיא נתן לוגו',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'גיא נתן | ייעוץ פיננסי וליווי כלכלי',
    description: 'האתר הרשמי של גיא נתן - ייעוץ וליווי פיננסי, עדכונים מעולם ההשקעות, מאמרים וידע כלכלי.',
    images: ['https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={assistant.className}>
      <body suppressHydrationWarning className={assistant.className}>
          <TradingViewTicker />
        <ClientLayout>
              {children}
        </ClientLayout>
      </body>
    </html>
  );
}
